//-----------------------------------------------------------------------
// <copyright file="ApplicationInsightsClientFactory.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.AIClient
{
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared;

    /// <summary>
    /// An implementation of the <see cref="IApplicationInsightsClientFactory"/> interface.
    /// </summary>
    public class ApplicationInsightsClientFactory : IApplicationInsightsClientFactory
    {
        /// <summary>
        /// Creates a new Application Insights Client instance.
        /// </summary>
        /// <returns>A Application Insights client instance.</returns>
        public IApplicationInsightsClient GetApplicationInsightsClient()
        {
            string applicationId = ConfigurationReader.ReadConfig("TelemetryApplicationId", required: true);

            return new ApplicationInsightsClient(applicationId);
        }
    }
}
