//-----------------------------------------------------------------------
// <copyright file="AddAlertRule.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Models
{
    using System.Collections.Generic;

    /// <summary>
    /// This class represents the model of the PUT alert rule operation request body.
    /// </summary>
    public class AddAlertRule
    {
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
        /// Gets or sets the signal's execution cadence in minutes.
        /// </summary>
        public int CadenceInMinutes { get; set; }

        /// <summary>
        /// Gets or sets the email recipients for the signal result
        /// </summary>
        public IList<string> EmailRecipients { get; set; }
    }
}
