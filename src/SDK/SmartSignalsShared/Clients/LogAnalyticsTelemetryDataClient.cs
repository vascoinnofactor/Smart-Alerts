﻿//-----------------------------------------------------------------------
// <copyright file="LogAnalyticsTelemetryDataClient.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Clients
{
    using System;
    using System.Collections.Generic;
    using Microsoft.Azure.Monitoring.SmartSignals.SignalResultPresentation;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// An implementation of <see cref="ITelemetryDataClient"/> to access log analytics workspaces.
    /// </summary>
    public class LogAnalyticsTelemetryDataClient : TelemetryDataClientBase
    {
        private const string UriFormat = "https://api.loganalytics.io/v1/workspaces/{0}/query";

        /// <summary>
        /// Initializes a new instance of the <see cref="LogAnalyticsTelemetryDataClient"/> class.
        /// </summary>
        /// <param name="tracer">The tracer</param>
        /// <param name="httpClientWrapper">The HTTP client wrapper</param>
        /// <param name="credentialsFactory">The credentials factory</param>
        /// <param name="workspaceId">The workspace Id on which the queries will run. If there are multiple workspaces, this should be the ID of one of them.</param>
        /// <param name="workspacesResourceIds">
        /// The resource IDs of the workspaces on which the queries will run.
        /// Can be null or empty if there is only one workspace to analyze. If there are multiple workspaces,
        /// one of these IDs need to match the workspace identified by the specified <paramref name="workspaceId"/>. 
        /// </param>
        /// <param name="queryTimeout">The query timeout.</param>
        public LogAnalyticsTelemetryDataClient(ITracer tracer, IHttpClientWrapper httpClientWrapper, ICredentialsFactory credentialsFactory, string workspaceId, IEnumerable<string> workspacesResourceIds, TimeSpan queryTimeout)
            : base(
                tracer,
                httpClientWrapper,
                credentialsFactory,
                new Uri(string.Format(UriFormat, workspaceId)),
                queryTimeout,
                TelemetryDbType.LogAnalytics,
                workspaceId,
                workspacesResourceIds)
        {
        }

        /// <summary>
        /// Update the HTTP request content with required values.
        /// </summary>
        /// <param name="requestContent">The request content.</param>
        protected override void UpdateRequestContent(JObject requestContent)
        {
            if (this.TelemetryResourceIds.Count > 1)
            {
                requestContent["workspaces"] = new JArray(this.TelemetryResourceIds);
            }
        }
    }
}
