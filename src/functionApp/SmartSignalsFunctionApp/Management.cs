//-----------------------------------------------------------------------
// <copyright file="Management.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.FunctionApp
{
    using System;
    using System.Collections.Specialized;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.FunctionApp.Authorization;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.EndpointsLogic;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Models;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Responses;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Host;
    using Unity;

    /// <summary>
    /// This class is the entry point for the management endpoints.
    /// </summary>
    public static class Management
    {
        private static readonly IUnityContainer Container;

        /// <summary>
        /// Initializes static members of the <see cref="Management"/> class.
        /// </summary>
        static Management()
        {
            // To increase Azure calls performance we increase default connection limit (default is 2) and ThreadPool minimum threads to allow more open connections
            ServicePointManager.DefaultConnectionLimit = 100;
            ThreadPool.SetMinThreads(100, 100);

            Container = DependenciesInjector.GetContainer()
                .RegisterType<IAuthorizationManagementClient, AuthorizationManagementClient>()
                .RegisterType<ISignalApi, SignalApi>()
                .RegisterType<IAlertRuleApi, AlertRuleApi>()
                .RegisterType<ISignalResultApi, SignalResultApi>();
        }

        /// <summary>
        /// Gets all the signal results.
        /// </summary>
        /// <param name="req">The incoming request.</param>
        /// <param name="log">The logger.</param>
        /// <param name="cancellationToken">A cancellation token to control the function's execution.</param>
        /// <returns>The signal results.</returns>
        [FunctionName("signalResult")]
        public static async Task<HttpResponseMessage> GetAllSmartSignalResults([HttpTrigger(AuthorizationLevel.Anonymous, "get")]HttpRequestMessage req, TraceWriter log, CancellationToken cancellationToken)
        {
            using (IUnityContainer childContainer = Container.CreateChildContainer().WithTracer(log, true))
            {
                ITracer tracer = childContainer.Resolve<ITracer>();
                var signalResultApi = childContainer.Resolve<ISignalResultApi>();
                var authorizationManagementClient = childContainer.Resolve<IAuthorizationManagementClient>();

                try
                {
                    // Check authorization
                    bool isAuthorized = await authorizationManagementClient.IsAuthorizedAsync(req, cancellationToken);
                    if (!isAuthorized)
                    {
                        return req.CreateErrorResponse(HttpStatusCode.Forbidden, "The client is not authorized to perform this action");
                    }

                    // Extract the url parameters
                    NameValueCollection queryParameters = req.RequestUri.ParseQueryString();

                    DateTime startTime;
                    if (!DateTime.TryParse(queryParameters.Get("startTime"), out startTime))
                    {
                        return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Given start time is not in valid format");
                    }

                    DateTime endTime;
                    if (!DateTime.TryParse(queryParameters.Get("endTime"), out endTime))
                    {
                        return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Given end time is not in valid format");
                    }

                    ListSmartSignalsResultsResponse smartSignalsResultsResponse = await signalResultApi.GetAllSmartSignalResultsAsync(startTime, endTime, cancellationToken);

                    return req.CreateResponse(smartSignalsResultsResponse);
                }
                catch (SmartSignalsManagementApiException e)
                {
                    tracer.TraceError($"Failed to get smart signals results due to managed exception: {e}");

                    return req.CreateErrorResponse(e.StatusCode, "Failed to get smart signals", e);
                }
                catch (Exception e)
                {
                    tracer.TraceError($"Failed to get smart signals results due to un-managed exception: {e}");

                    return req.CreateErrorResponse(HttpStatusCode.InternalServerError, "Failed to get smart signals", e);
                }
            }
        }

        /// <summary>
        /// Gets all the smart signals.
        /// </summary>
        /// <param name="req">The incoming request.</param>
        /// <param name="log">The logger.</param>
        /// <param name="cancellationToken">A cancellation token to control the function's execution.</param>
        /// <returns>The smart signals encoded as JSON.</returns>
        [FunctionName("signal")]
        public static async Task<HttpResponseMessage> GetAllSmartSignals([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestMessage req, TraceWriter log, CancellationToken cancellationToken)
        {
            using (IUnityContainer childContainer = Container.CreateChildContainer().WithTracer(log, true))
            {
                ITracer tracer = childContainer.Resolve<ITracer>();
                var signalApi = childContainer.Resolve<ISignalApi>();
                var authorizationManagementClient = childContainer.Resolve<IAuthorizationManagementClient>();

                try
                {
                    // Check authorization
                    bool isAuthorized = await authorizationManagementClient.IsAuthorizedAsync(req, cancellationToken);
                    if (!isAuthorized)
                    {
                        return req.CreateErrorResponse(HttpStatusCode.Forbidden, "The client is not authorized to perform this action");
                    }

                    ListSmartSignalsResponse smartSignals = await signalApi.GetAllSmartSignalsAsync(cancellationToken);

                    return req.CreateResponse(smartSignals);
                }
                catch (SmartSignalsManagementApiException e)
                {
                    tracer.TraceError($"Failed to get smart signals due to managed exception: {e}");

                    return req.CreateErrorResponse(e.StatusCode, "Failed to get smart signals", e);
                }
                catch (Exception e)
                {
                    tracer.TraceError($"Failed to get smart signals due to un-managed exception: {e}");

                    return req.CreateErrorResponse(HttpStatusCode.InternalServerError, "Failed to get smart signals", e);
                }
            }
        }

        /// <summary>
        /// Add the given alert rule to the alert rules store..
        /// </summary>
        /// <param name="req">The incoming request.</param>
        /// <param name="log">The logger.</param>
        /// <param name="cancellationToken">A cancellation token to control the function's execution.</param>
        /// <returns>200 if request was successful, 500 if not.</returns>
        [FunctionName("alertRule")]
        public static async Task<HttpResponseMessage> AddAlertRule([HttpTrigger(AuthorizationLevel.Anonymous, "put")] HttpRequestMessage req, TraceWriter log, CancellationToken cancellationToken)
        {
            using (IUnityContainer childContainer = Container.CreateChildContainer().WithTracer(log, true))
            {
                ITracer tracer = childContainer.Resolve<ITracer>();
                var alertRuleApi = childContainer.Resolve<IAlertRuleApi>();
                var authorizationManagementClient = childContainer.Resolve<IAuthorizationManagementClient>();

                // Read given parameters from body
                var addAlertRule = await req.Content.ReadAsAsync<AddAlertRule>();

                try
                {
                    // Check authorization
                    bool isAuthorized = await authorizationManagementClient.IsAuthorizedAsync(req, cancellationToken);
                    if (!isAuthorized)
                    {
                        return req.CreateErrorResponse(HttpStatusCode.Forbidden, "The client is not authorized to perform this action");
                    }

                    await alertRuleApi.AddAlertRuleAsync(addAlertRule, cancellationToken);

                    return req.CreateResponse(HttpStatusCode.OK);
                }
                catch (SmartSignalsManagementApiException e)
                {
                    tracer.TraceError($"Failed to add alert rule due to managed exception: {e}");

                    return req.CreateErrorResponse(e.StatusCode, "Failed to add the given alert rule", e);
                }
                catch (Exception e)
                {
                    tracer.TraceError($"Failed to add alert rule due to un-managed exception: {e}");

                    return req.CreateErrorResponse(HttpStatusCode.InternalServerError, "Failed to add the given alert rule", e);
                }
            }
        }
    }
}
