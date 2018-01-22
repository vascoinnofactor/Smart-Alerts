//-----------------------------------------------------------------------
// <copyright file="SmartSignalResultItemQueryRunInfo.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.SignalResultPresentation
{
    using System.Collections.Generic;
    using Newtonsoft.Json;

    /// <summary>
    /// This class provides information on how to run queries that are part of a <see cref="SmartSignalResultItemPresentation"/> object. 
    /// </summary>
    public class SmartSignalResultItemQueryRunInfo
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SmartSignalResultItemQueryRunInfo"/> class.
        /// </summary>
        /// <param name="type">The telemetry database type</param>
        /// <param name="resourceIds">The telemetry resource Ids</param>
        public SmartSignalResultItemQueryRunInfo(TelemetryDbType type, IReadOnlyList<string> resourceIds)
        {
            this.Type = type;
            this.ResourceIds = resourceIds;
        }

        /// <summary>
        /// Gets the telemetry database type
        /// </summary>
        [JsonProperty("type")]
        public TelemetryDbType Type { get; }

        /// <summary>
        /// Gets the telemetry resource Ids
        /// </summary>
        [JsonProperty("resourceIds")]
        public IReadOnlyList<string> ResourceIds { get; }
    }
}
