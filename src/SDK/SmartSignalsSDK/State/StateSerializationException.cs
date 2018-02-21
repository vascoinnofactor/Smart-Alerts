// <copyright file="StateSerializationException.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    using System;

    /// <summary>
    /// Represents an exception caused by state serialization issue.  
    /// </summary>
    public class StateSerializationException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StateSerializationException"/> class
        /// </summary>
        /// <param name="innerException">The actual exception that was thrown by the serializer</param>
        public StateSerializationException(Exception innerException)
            : base("State serialization/deserialization failed. See inner exception for more details. If you would like to use custom serialization logic - serialize the state in client code and store it as a 'System.String'.", innerException)
        {
        }
    }
}
