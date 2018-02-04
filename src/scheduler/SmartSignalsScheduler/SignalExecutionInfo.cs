﻿//-----------------------------------------------------------------------
// <copyright file="SignalExecutionInfo.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Scheduler
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Signal execution information
    /// </summary>
    public class SignalExecutionInfo
    {
        /// <summary>
        /// Gets or sets the rule ID
        /// </summary>
        public string RuleId { get; set; }

        /// <summary>
        /// Gets or sets the signal ID
        /// </summary>
        public string SignalId { get; set; }

        /// <summary>
        /// Gets or sets the current execution time
        /// </summary>
        public DateTime CurrentExecutionTime { get; set; }

        /// <summary>
        /// Gets or sets the last execution time
        /// </summary>
        public DateTime? LastExecutionTime { get; set; }

        /// <summary>
        /// Gets or sets the signal configured cadence
        /// </summary>
        public TimeSpan Cadence { get; set; }

        /// <summary>
        /// Gets or sets the email recipients for the signal result
        /// </summary>
        public IList<string> EmailRecipients { get; set; }
    }
}
