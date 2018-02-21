﻿//-----------------------------------------------------------------------
// <copyright file="IncompatibleResourceTypesException.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.Analysis
{
    using System;
    using System.Runtime.Serialization;
    using Microsoft.Azure.Monitoring.SmartAlerts.Package;

    /// <summary>
    /// This exception is thrown when the requested resource type is not supported by the requested signal.
    /// </summary>
    [Serializable]
    public class IncompatibleResourceTypesException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="IncompatibleResourceTypesException"/> class
        /// with the specified error message.
        /// </summary>
        /// <param name="requestResourceType">The requested resource type</param>
        /// <param name="smartSignalManifest">The signal manifest</param>
        public IncompatibleResourceTypesException(ResourceType requestResourceType, SmartSignalManifest smartSignalManifest)
            : base($"Resource type {requestResourceType} is not supported by signal {smartSignalManifest.Name}")
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="IncompatibleResourceTypesException"/> class
        /// with serialized data.
        /// </summary>
        /// <param name="info">The <see cref="T:System.Runtime.Serialization.SeraizliationInfo"/> that holds the serialized
        /// object data about the exception being thrown.</param>
        /// <param name="context">The <see cref="T:System.Runtime.Serialization.StreamingContext"/> that contains contextual
        /// information about the source or destination.</param>
        protected IncompatibleResourceTypesException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}