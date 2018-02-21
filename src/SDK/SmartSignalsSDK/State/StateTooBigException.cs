//-----------------------------------------------------------------------
// <copyright file="StateTooBigException.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    using System;

    /// <summary>
    /// Represents an exception caused by an attempt to store state object that is too big. 
    /// </summary>
    public class StateTooBigException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StateTooBigException"/> class
        /// </summary>
        /// <param name="serializedStateLength">The length of serialized state string</param>
        /// <param name="maxAllowedSerializedStateLength">Maximum allowed length of serialized state string</param>
        public StateTooBigException(
            long serializedStateLength, 
            long maxAllowedSerializedStateLength) 
            : base($"Serialized state string is too long ({serializedStateLength} characters), maximum allowed length is {maxAllowedSerializedStateLength}")
        {
            this.SerializedStateLength = serializedStateLength;
            this.MaxAllowedSerializedStateLength = maxAllowedSerializedStateLength;
        }

        /// <summary>
        /// Gets the length of serialized state string
        /// </summary>
        public long SerializedStateLength { get; }

        /// <summary>
        /// Gets maximum allowed length of serialized state string
        /// </summary>
        public long MaxAllowedSerializedStateLength { get; }
    }
}
