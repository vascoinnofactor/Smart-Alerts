//-----------------------------------------------------------------------
// <copyright file="IEmailSender.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.Scheduler.Publisher
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartAlerts.SignalResultPresentation;

    /// <summary>
    /// An interface for sending Smart Signal results Email
    /// </summary>
    public interface IEmailSender
    {
        /// <summary>
        /// Sends the Smart Signal result Email.
        /// </summary>
        /// <param name="signalExecution">The signals execution information.</param>
        /// <param name="smartSignalResultItems">The Smart Signal result items.</param>
        /// <returns>The task object representing the asynchronous operation.</returns>
        Task SendSignalResultEmailAsync(SignalExecutionInfo signalExecution, IList<SmartSignalResultItemPresentation> smartSignalResultItems);
    }
}
