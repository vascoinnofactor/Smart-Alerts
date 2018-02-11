//-----------------------------------------------------------------------
// <copyright file="ServerThrottlingException.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Clients
{
    using System;
    using System.Runtime.Serialization;

    /// <summary>
    /// This exception is thrown when there was an error running an analytics query.
    /// </summary>
    [Serializable]
    public class ServerThrottlingException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ServerThrottlingException"/> class.
        /// </summary>
        /// <param name="timeToWaitInSeconds">the time to wait (in seconds)</param>
        public ServerThrottlingException(int timeToWaitInSeconds)
            : base($"Throttling error recieved from the server, retry in {timeToWaitInSeconds} seconds")
        {
            this.TimeToWaitInSeconds = timeToWaitInSeconds;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ServerThrottlingException"/> class
        /// with serialized data.
        /// </summary>
        /// <param name="info">The <see cref="T:System.Runtime.Serialization.SeraizliationInfo"/> that holds the serialized
        /// object data about the exception being thrown.</param>
        /// <param name="context">The <see cref="T:System.Runtime.Serialization.StreamingContext"/> that contains contextual
        /// information about the source or destination.</param>
        protected ServerThrottlingException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }

        /// <summary>
        /// Gets the time to wait (in seconds)
        /// </summary>
        public int TimeToWaitInSeconds { get; }
    }
}