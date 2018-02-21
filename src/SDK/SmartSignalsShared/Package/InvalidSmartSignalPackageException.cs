﻿//-----------------------------------------------------------------------
// <copyright file="InvalidSmartSignalPackageException.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Package
{
    using System;
    using System.Runtime.Serialization;

    /// <summary>
    /// This exception is thrown when the smart signal package is invalid
    /// </summary>
    [Serializable]
    public class InvalidSmartSignalPackageException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="InvalidSmartSignalPackageException"/> class.
        /// </summary>
        /// <param name="message">The exception message.</param>
        public InvalidSmartSignalPackageException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="InvalidSmartSignalPackageException"/> class.
        /// </summary>
        /// <param name="message">The exception message.</param>
        /// <param name="e">The inner exception.</param>
        public InvalidSmartSignalPackageException(string message, Exception e) : base(message, e)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="InvalidSmartSignalPackageException"/> class
        /// with serialized data.
        /// </summary>
        /// <param name="info">The <see cref="T:System.Runtime.Serialization.SeraizliationInfo"/> that holds the serialized
        /// object data about the exception being thrown.</param>
        /// <param name="context">The <see cref="T:System.Runtime.Serialization.StreamingContext"/> that contains contextual
        /// information about the source or destination.</param>
        protected InvalidSmartSignalPackageException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
