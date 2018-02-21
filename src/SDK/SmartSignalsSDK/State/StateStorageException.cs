//-----------------------------------------------------------------------
// <copyright file="StateStorageException.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    using System;

    /// <summary>
    /// Represents an exception caused by issue with storing or retrieving state from storage.  
    /// </summary>
    public class StateStorageException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StateStorageException"/> class
        /// </summary>
        /// <param name="innerException">The actual exception that was thrown by storage</param>
        public StateStorageException(Exception innerException)
            : base("Unable to save or retrieve state from storage. See inner exception for more details.", innerException)
        {
        }
    }
}
