//-----------------------------------------------------------------------
// <copyright file="AlertRule.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AlertRules
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Holds an alert rule
    /// </summary>
    public class AlertRule
    {
        /// <summary>
        /// Gets or sets the rule ID.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the alert rule name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the alert rule description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the signal ID.
        /// </summary>
        public string SignalId { get; set; }

        /// <summary>
        /// Gets or sets the resource to be analyzed by the signal.
        /// </summary>
        public string ResourceId { get; set; }

        /// <summary>
        /// Gets or sets the signal's execution cadence.
        /// </summary>
        public TimeSpan Cadence { get; set; }

        /// <summary>
        /// Gets or sets the email recipients for the signal result
        /// </summary>
        public IList<string> EmailRecipients { get; set; }
    }
}