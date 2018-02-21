//-----------------------------------------------------------------------
// <copyright file="TelemetryDbType.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.SignalResultPresentation
{
    /// <summary>
    /// An enum for the type of DB on which to run queries that are part of a smart signal result presentation
    /// </summary>
    public enum TelemetryDbType
    {
        /// <summary>
        /// The query should run on a log analytics workspace
        /// </summary>
        LogAnalytics,

        /// <summary>
        /// The query should run on am application insights app
        /// </summary>
        ApplicationInsights
    }
}
