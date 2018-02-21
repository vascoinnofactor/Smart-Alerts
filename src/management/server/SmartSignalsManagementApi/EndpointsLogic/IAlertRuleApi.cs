﻿//-----------------------------------------------------------------------
// <copyright file="IAlertRuleApi.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.EndpointsLogic
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Models;

    /// <summary>
    /// This class is the logic for the /alertRule endpoint.
    /// </summary>
    public interface IAlertRuleApi
    {
        /// <summary>
        /// Add the given alert rule to the alert rules store.
        /// </summary>
        /// <returns>A task represents this operation.</returns>
        /// <param name="addAlertRule">The model that contains all the require parameters for adding alert rule.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <exception cref="SmartSignalsManagementApiException">This exception is thrown when we failed to add the alert rule.</exception>
        Task AddAlertRuleAsync(AlertRuleApiEntity addAlertRule, CancellationToken cancellationToken);

        /// <summary>
        /// Get the alert rules from the alert rules store.
        /// </summary>
        /// <returns>The alert rules list.</returns>
        /// <exception cref="SmartSignalsManagementApiException">This exception is thrown when we failed to get the alert rules.</exception>
        Task<IList<RuntimeShared.AlertRules.AlertRule>> GetAlertRulesAsync();
    }
}
