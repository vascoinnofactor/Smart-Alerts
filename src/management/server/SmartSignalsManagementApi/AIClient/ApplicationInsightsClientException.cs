﻿//-----------------------------------------------------------------------
// <copyright file="ApplicationInsightsClientException.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.AIClient
{
    using System;

    /// <summary>
    /// This exception is thrown when the we failed to query the AI Rest API
    /// </summary>
    public class ApplicationInsightsClientException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="T:Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.AIClient.ApplicationInsightsClientException" /> class
        /// with the specified error message and inner exception.
        /// </summary>
        /// <param name="message">The error message</param>
        public ApplicationInsightsClientException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="T:Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.AIClient.ApplicationInsightsClientException" /> class
        /// with the specified error message and exception.
        /// </summary>
        /// <param name="message">The error message</param>
        /// <param name="exception">The original exception</param>
        public ApplicationInsightsClientException(string message, Exception exception) : base(message, exception)
        {
        }
    }
}
