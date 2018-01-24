﻿//-----------------------------------------------------------------------
// <copyright file="ApplicationInsightsClient.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.AIClient
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Extensions;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.HttpClient;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// This class is responsible for querying Application Insights via Rest API
    /// </summary>
    public class ApplicationInsightsClient : IApplicationInsightsClient
    {
        private readonly IHttpClientWrapper httpClient;
        private readonly string applicationId;
        private readonly Uri applicationInsightUri = new Uri("https://api.applicationinsights.io");

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationInsightsClient"/> class.
        /// </summary>
        /// <param name="applicationId">The AI application id.</param>
        public ApplicationInsightsClient(string applicationId)
        {
            this.applicationId = applicationId;
            this.httpClient = new HttpClientWrapper();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationInsightsClient"/> class.
        /// We are using this constructor for UTs.
        /// </summary>
        /// <param name="applicationId">The AI application id.</param>
        /// <param name="httpClient">The HTTP client.</param>
        internal ApplicationInsightsClient(string applicationId, IHttpClientWrapper httpClient)
        {
            this.applicationId = applicationId;
            this.httpClient = httpClient;
        }

        /// <summary>
        /// Gets all the custom events from Application Insights for the configured application by the given filtering.
        /// </summary>
        /// <param name="eventName">The custom event name.</param>
        /// <param name="startTime">(optional) filtering by start time.</param>
        /// <param name="endTime">(optional) filtering by end time.</param>
        /// <param name="cancellationToken">(optional) The cancellation token.</param>
        /// <returns>The Application Insights events.</returns>
        public async Task<IEnumerable<ApplicationInsightsEvent>> GetCustomEventsAsync(
            string eventName,
            DateTime? startTime = null,
            DateTime? endTime = null,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            Diagnostics.EnsureStringNotNullOrWhiteSpace(() => eventName);
            Diagnostics.EnsureArgument(startTime.HasValue && endTime.HasValue ? startTime <= endTime : true, () => startTime, "End time must be after start time");

            try
            {
                var appInsightsRelativeUrl = $"/v1/apps/{this.applicationId}/events/customEvents";

                // Filter by event name
                appInsightsRelativeUrl += $"?$filter=customEvent/name eq '{eventName}'";

                // Add timestamp filters in case it's required
                if (startTime.HasValue && endTime.HasValue)
                {
                    appInsightsRelativeUrl += $" and timestamp ge {startTime.Value.ToQueryTimeFormat()} and timestamp le {endTime.Value.ToQueryTimeFormat()}";
                }
                else if (startTime.HasValue)
                {
                    appInsightsRelativeUrl += $" and timestamp ge {startTime.Value.ToQueryTimeFormat()}";
                }
                else if (endTime.HasValue)
                {
                    appInsightsRelativeUrl += $" and timestamp le {endTime.Value.ToQueryTimeFormat()}";
                }

                // TODO - generate a token for talking with AI
                // Send the AI Rest API request
                using (var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, new Uri(this.applicationInsightUri, appInsightsRelativeUrl)))
                {
                    // Add the authorization token
                    Tuple<string, string> authorizationHeader = this.GetAuthorizationHeader();
                    httpRequestMessage.Headers.Add(authorizationHeader.Item1, new List<string>() { authorizationHeader.Item2 });

                    using (HttpResponseMessage response = await this.httpClient.SendAsync(httpRequestMessage, cancellationToken))
                    {
                        string responseContent = await response.Content.ReadAsStringAsync();

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new ApplicationInsightsClientException($"Failed to query AI endpoint. Status code: {response.StatusCode}, response: {responseContent}");
                        }
                        
                        JObject appInsightsEventsAsJson = JObject.Parse(responseContent);

                        return JsonConvert.DeserializeObject<IEnumerable<ApplicationInsightsEvent>>(appInsightsEventsAsJson["value"].ToString());
                    }
                }
            }
            catch (HttpRequestException e)
            {
                throw new ApplicationInsightsClientException("Failed to query AI endpoint", e);
            }
            catch (JsonException e)
            {
                throw new ApplicationInsightsClientException($"Failed to de-serialize the returned AI data", e);
            }
        }

        /// <summary>
        /// Get an authorization header for the Application Insight request.
        /// </summary>
        /// <returns>The authorization token.</returns>
        private Tuple<string, string> GetAuthorizationHeader()
        {
            return new Tuple<string, string>("Authorization", "bearer someTokenWillBeHere");
        }
    }
}
