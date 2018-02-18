//-----------------------------------------------------------------------
// <copyright file="BlobState.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    /// <summary>
    /// Represents a signal state written to a blob
    /// </summary>
    public class BlobState
    {
        /// <summary>
        /// Gets or sets the signal id
        /// </summary>
        public string SignalId { get; set; }

        /// <summary>
        /// Gets or sets the signal key
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// Gets or sets the signal serialized state
        /// </summary>
        public string SerializedState { get; set; }
    }
}
