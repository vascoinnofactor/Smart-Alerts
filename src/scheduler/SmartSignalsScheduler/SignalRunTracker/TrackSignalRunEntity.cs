﻿//-----------------------------------------------------------------------
// <copyright file="TrackSignalRunEntity.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.Scheduler.SignalRunTracker
{
    using System;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// A row holds the last successful run of a signal job.
    /// The rule ID is the row key.
    /// </summary>
    public class TrackSignalRunEntity : TableEntity
    {
        /// <summary>
        /// Gets or sets the signal ID
        /// </summary>
        public string SignalId { get; set; }

        /// <summary>
        /// Gets or sets the last successful run execution time
        /// </summary>
        public DateTime LastSuccessfulExecutionTime { get; set; }
    }
}
