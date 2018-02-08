//-----------------------------------------------------------------------
// <copyright file="ListResourcesResponse.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Responses
{
    using System.Collections.Generic;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Models;
    using Newtonsoft.Json;

    /// <summary>
    /// This class represents the GET Management API operation for listing resources.
    /// </summary>
    public class ListResourcesResponse
    {
        /// <summary>
        /// Gets or sets the resources
        /// </summary>
        [JsonProperty("subscriptionResources")]
        public List<AzureSubscriptionResources> SubscriptionResources { get; set; }
    }
}
