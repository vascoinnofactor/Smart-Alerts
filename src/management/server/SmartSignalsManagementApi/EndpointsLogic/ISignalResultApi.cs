﻿//-----------------------------------------------------------------------
// <copyright file="ISignalResultApi.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.EndpointsLogic
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.Responses;

    /// <summary>
    /// This class is the logic for the /signalResult endpoint.
    /// </summary>
    public interface ISignalResultApi
    {
        /// <summary>
        /// Gets all the Smart Signals results.
        /// </summary>
        /// <param name="startTime">The query start time.</param>
        /// <param name="endTime">(optional) The query end time.</param>
        /// <param name="cancellationToken">(optional) The cancellation token.</param>
        /// <returns>The Smart Signals results response.</returns>
        Task<ListSmartSignalsResultsResponse> GetAllSmartSignalResultsAsync(DateTime startTime, DateTime? endTime = null, CancellationToken cancellationToken = default(CancellationToken));
    }
}
