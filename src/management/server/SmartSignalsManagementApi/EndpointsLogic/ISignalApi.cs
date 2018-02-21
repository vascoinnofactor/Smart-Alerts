﻿//-----------------------------------------------------------------------
// <copyright file="ISignalApi.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.EndpointsLogic
{
    using System.Threading;
    using System.Threading.Tasks;
    using Responses;

    /// <summary>
    /// This interface represents the /signal API logic.
    /// </summary>
    public interface ISignalApi
    {
        /// <summary>
        /// Gets all the smart signals.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>The smart signals.</returns>
        /// <exception cref="SmartSignalsManagementApiException">This exception is thrown when we failed to retrieve smart signals.</exception>
        Task<ListSmartSignalsResponse> GetAllSmartSignalsAsync(CancellationToken cancellationToken);
    }
}
