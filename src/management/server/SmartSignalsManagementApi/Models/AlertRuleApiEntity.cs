//-----------------------------------------------------------------------
// <copyright file="AlertRuleApiEntity.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Models
{
    using System.Collections.Generic;
    using Newtonsoft.Json;

    /// <summary>
    /// This class represents the returned model of the /alertRule endpoint.
    /// </summary>
    public class AlertRuleApiEntity
    {
        /// <summary>
        /// Gets or sets the alert rule name
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the alert rule description
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the signal ID.
        /// </summary>
        [JsonProperty("signalId")]
        public string SignalId { get; set; }

        /// <summary>
        /// Gets or sets the resource to be analyzed by the signal.
        /// </summary>
        [JsonProperty("resourceId")]
        public string ResourceId { get; set; }

        /// <summary>
        /// Gets or sets the signal's execution cadence in minutes.
        /// </summary>
        [JsonProperty("cadenceInMinutes")]
        public int CadenceInMinutes { get; set; }

        /// <summary>
        /// Gets or sets the email recipients for the signal result
        /// </summary>
        [JsonProperty("emailRecipients")]
        public IList<string> EmailRecipients { get; set; }
    }
}
