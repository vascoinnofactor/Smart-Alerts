//-----------------------------------------------------------------------
// <copyright file="Resource.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.FunctionApp
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.Clients;
    using Microsoft.Azure.Monitoring.SmartSignals.FunctionApp.Authorization;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Models;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Responses;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Host;
    using Unity;

    /// <summary>
    /// This class is the entry point for the resource endpoint.
    /// This endpoint provides information about the available resources for this framework.
    /// </summary>
    public static class Resource
    {
        private static readonly IUnityContainer Container;

        /// <summary>
        /// Initializes static members of the <see cref="Resource"/> class.
        /// </summary>
        static Resource()
        {
            // To increase Azure calls performance we increase default connection limit (default is 2) and ThreadPool minimum threads to allow more open connections
            ServicePointManager.DefaultConnectionLimit = 100;
            ThreadPool.SetMinThreads(100, 100);

            Container = DependenciesInjector.GetContainer()
                .RegisterType<IAuthorizationManagementClient, AuthorizationManagementClient>()
                .RegisterType<IAzureResourceManagerClient, AzureResourceManagerClient>()
                .RegisterType<ICredentialsFactory, MsiCredentialsFactory>();
        }

        /// <summary>
        /// Gets all the available subscription ids.
        /// </summary>
        /// <param name="req">The incoming request.</param>
        /// <param name="log">The logger.</param>
        /// <param name="cancellationToken">A cancellation token to control the function's execution.</param>
        /// <returns>The available subscription ids.</returns>
        [FunctionName("resource")]
        public static async Task<HttpResponseMessage> GetAllAvailableSubscriptionIds([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestMessage req, TraceWriter log, CancellationToken cancellationToken)
        {
            using (IUnityContainer childContainer = Container.CreateChildContainer().WithTracer(log, true))
            {
                ITracer tracer = childContainer.Resolve<ITracer>();
                var authorizationManagementClient = childContainer.Resolve<IAuthorizationManagementClient>();
                var azureResourceManagerClient = childContainer.Resolve<IAzureResourceManagerClient>();

                try
                {
                    // Check authorization
                    bool isAuthorized = await authorizationManagementClient.IsAuthorizedAsync(req, cancellationToken);
                    if (!isAuthorized)
                    {
                        return req.CreateErrorResponse(HttpStatusCode.Forbidden, "The client is not authorized to perform this action");
                    }

                    List<AzureSubscription> subscriptions = (await azureResourceManagerClient.GetAllSubscriptionsAsync(cancellationToken)).ToList();

                    var supportedResourceTypes = new[] { ResourceType.ApplicationInsights, ResourceType.LogAnalytics, ResourceType.VirtualMachine, ResourceType.VirtualMachineScaleSet };

                    // Get all the resources for all the retrieved subscriptions
                    // The return value will be list of lists of resources (one per subscription)
                    var subscriptionsResources = await Task.WhenAll(subscriptions.Select(subscription => azureResourceManagerClient.GetAllResourcesInSubscriptionAsync(
                                                                                                                                            subscription.Id,
                                                                                                                                            resourceTypes: supportedResourceTypes,
                                                                                                                                            cancellationToken: cancellationToken,
                                                                                                                                            maxResourcesToReturn: null)));
                    
                    var azureSubscriptionResources = new List<AzureSubscriptionResources>();

                    // Go over each group of resources (which correspond to a subscription) and create the mapping which will be returned
                    foreach (var subscriptionResources in subscriptionsResources)
                    {
                        AzureSubscription subscriptionInformation = subscriptions.First(subscription => subscription.Id == subscriptionResources.First().SubscriptionId);
                        azureSubscriptionResources.Add(new AzureSubscriptionResources()
                        {
                            Subscription = subscriptionInformation,
                            Resources = subscriptionResources.ToList()
                        });
                    }

                    return req.CreateResponse(new ListResourcesResponse()
                    {
                        Resources = azureSubscriptionResources
                    });
                }
                catch (Exception e)
                {
                    tracer.TraceError($"Failed to get Azure resources due to an exception: {e}");

                    return req.CreateErrorResponse(HttpStatusCode.InternalServerError, $"Failed to get Azure resources: {e}", e);
                }
            }
        }
    }
}