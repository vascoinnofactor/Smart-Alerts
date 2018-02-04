//-----------------------------------------------------------------------
// <copyright file="AlertRule.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AlertRules
{
    using System.Collections.Generic;
    using NCrontab;

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
        /// Gets or sets the signal ID.
        /// </summary>
        public string SignalId { get; set; }

        /// <summary>
        /// Gets or sets the resource type supported by the signal.
        /// </summary>
        public ResourceType ResourceType { get; set; }

        /// <summary>
        /// Gets or sets the signal's schedule.
        /// </summary>
        public CrontabSchedule Schedule { get; set; }

        /// <summary>
        /// Gets or sets the email recipients for the signal result
        /// </summary>
        public IList<string> EmailRecipients { get; set; }
    }
}