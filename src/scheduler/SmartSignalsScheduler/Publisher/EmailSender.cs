//-----------------------------------------------------------------------
// <copyright file="EmailSender.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Scheduler.Publisher
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.SignalResultPresentation;
    using Microsoft.Azure.Monitoring.SmartSignals.Scheduler.Exceptions;
    using Microsoft.Azure.Monitoring.SmartSignals.Tools;
    using SendGrid;
    using SendGrid.Helpers.Mail;
    using Unity.Attributes;

    /// <summary>
    /// This class is responsible for sending Smart Signal results Email
    /// </summary>
    public class EmailSender : IEmailSender
    {
        internal const string SignalNamePlaceHolder = "[signalName]";
        internal const string ResourceNamePlaceHolder = "[resourceName]";
        internal const string LinkToPortalPlaceHolder = "[linkToPortal]";
        internal const string RuleNamePlaceHolder = "[ruleName]";
        internal const string RuleDescriptionPlaceHolder = "[ruleDescription]";
        internal const string ServiceNamePlaceHolder = "[serviceName]";
        internal const string AlertActivatedTimePlaceHolder = "[alertActivatedTime]";
        internal const string SubscriptionNamePlaceHolder = "[subscriptionName]";
        internal const string LinkToFeedbackPlaceHolder = "[linkToFeedback]";

        private ITracer tracer;
        private ISendGridClient sendGridClient;
        
        /// <summary>
        /// Initializes a new instance of the <see cref="EmailSender"/> class.
        /// </summary>
        /// <param name="tracer">The tracer to use.</param>
        [InjectionConstructor]
        public EmailSender(ITracer tracer)
        {
            this.tracer = Diagnostics.EnsureArgumentNotNull(() => tracer);

            var apiKey = ConfigurationReader.ReadConfig("SendgridApiKey", false);
            this.sendGridClient = string.IsNullOrWhiteSpace(apiKey) ? null : new SendGridClient(apiKey);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailSender"/> class.
        /// </summary>
        /// <param name="tracer">The tracer to use.</param>
        /// <param name="sendGridClient">The send grid client.</param>
        public EmailSender(ITracer tracer, ISendGridClient sendGridClient)
        {
            this.tracer = Diagnostics.EnsureArgumentNotNull(() => tracer);
            this.sendGridClient = sendGridClient;
        }

        /// <summary>
        /// Sends the Smart Signal result Email.
        /// </summary>
        /// <param name="emailRecipients">A list of email recipients to send the mail to.</param>
        /// <param name="signalId">The signal ID.</param>
        /// <param name="smartSignalResultItems">The Smart Signal result items.</param>
        /// <returns>The task object representing the asynchronous operation.</returns>
        public async Task SendSignalResultEmailAsync(IList<string> emailRecipients, string signalId, IList<SmartSignalResultItemPresentation> smartSignalResultItems)
        {
            if (this.sendGridClient == null)
            {
                this.tracer.TraceWarning("SendGrid API key was not found, not sending email");
                return;
            }

            if (emailRecipients == null || !emailRecipients.Any())
            {
                this.tracer.TraceWarning("Email recipients were not provided, not sending email");
                return;
            }

            if (smartSignalResultItems == null || !smartSignalResultItems.Any())
            {
                this.tracer.TraceInformation($"no result items to publish for signal {signalId}");
                return;
            }

            this.tracer.TraceInformation($"Sending signal result email for signal {signalId}");

            foreach (SmartSignalResultItemPresentation signal in smartSignalResultItems)
            {
                // TODO: Parse the smart signal result to an HTML and add a link to the SiRA UI
                string emailBody = Resources.SmartSignalEmailTemplate
                    .Replace(SignalNamePlaceHolder, signal.SignalName)
                    .Replace(ResourceNamePlaceHolder, signal.ResourceId)
                    .Replace(LinkToPortalPlaceHolder, string.Empty)
                    .Replace(RuleNamePlaceHolder, "Get from the ScheduleFlow/AlertRule") 
                    .Replace(RuleDescriptionPlaceHolder, "Get from the ScheduleFlow/AlertRule")
                    .Replace(ServiceNamePlaceHolder, "Get from the ScheduleFlow/AlertRule")
                    .Replace(AlertActivatedTimePlaceHolder, "Get from the ScheduleFlow/AlertRule")
                    .Replace(SubscriptionNamePlaceHolder, signal.SubscriptionId)
                    .Replace(LinkToFeedbackPlaceHolder, "https://ms.portal.azure.com/");
            }

            var msg = new SendGridMessage
            {
                From = new EmailAddress("smartsignals@microsoft.com", "Smart Signals"),
                Subject = $"Found new {smartSignalResultItems.Count} result items for signal {signalId}",
                PlainTextContent = "Found new result items!",
                HtmlContent = "<strong>Found new result items!</strong>"
            };

            var emailAddresses = emailRecipients.Select(email => new EmailAddress(email)).ToList();
            msg.AddTos(emailAddresses);
            var response = await this.sendGridClient.SendEmailAsync(msg);

            if (!IsSuccessStatusCode(response.StatusCode))
            {
                string content = response.Body != null ? await response.Body.ReadAsStringAsync() : string.Empty;
                var message = $"Failed to send signal results Email for signal {signalId}. Fail StatusCode: {response.StatusCode}. Content: {content}.";
                throw new EmailSendingException(message);
            }

            this.tracer.TraceInformation($"Sent signal result email successfully for signal {signalId}");
        }

        /// <summary>
        /// Checks if the status code is a success status code
        /// </summary>
        /// <param name="statusCode">The status code</param>
        /// <returns>True if the status code is a success status code, false otherwise</returns>
        private static bool IsSuccessStatusCode(HttpStatusCode statusCode)
        {
            return (int)statusCode >= 200 && (int)statusCode <= 299;
        }
    }
}
