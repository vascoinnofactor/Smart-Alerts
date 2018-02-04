//-----------------------------------------------------------------------
// <copyright file="EmailSenderTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalSchedulerTests
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AlertRules;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.SignalResultPresentation;
    using Microsoft.Azure.Monitoring.SmartSignals.Scheduler;
    using Microsoft.Azure.Monitoring.SmartSignals.Scheduler.Exceptions;
    using Microsoft.Azure.Monitoring.SmartSignals.Scheduler.Publisher;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;
    using SendGrid;
    using SendGrid.Helpers.Mail;

    [TestClass]
    public class EmailSenderTests
    {
        private EmailSender emailSender;
        private Mock<ISendGridClient> sendgridClientMock;
        private IList<string> emailRecipients;
        private SignalExecutionInfo signalExecutionInfo;

        [TestInitialize]
        public void Setup()
        {
            var tracerMock = new Mock<ITracer>();
            this.sendgridClientMock = new Mock<ISendGridClient>();
            this.emailSender = new EmailSender(tracerMock.Object, this.sendgridClientMock.Object);
            this.emailRecipients = new List<string> { "some@email.com" };
            this.signalExecutionInfo = new SignalExecutionInfo()
            {
                AlertRule = new AlertRule
                {
                    SignalId = "s1",
                    Id = "r1",
                    ResourceId = "resourceId1",
                    EmailRecipients = new List<string>() { "someEmail@microsoft.com" }
                },
                CurrentExecutionTime = DateTime.UtcNow,
                LastExecutionTime = DateTime.UtcNow.AddHours(-1),
                Cadence = new TimeSpan()
            };
        }

        [TestMethod]
        public async Task WhenNoResultItemsAreFoundThenEmailIsNotSent()
        {
            await this.emailSender.SendSignalResultEmailAsync(this.signalExecutionInfo, new List<SmartSignalResultItemPresentation>());
            this.sendgridClientMock.Verify(m => m.SendEmailAsync(It.IsAny<SendGridMessage>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [TestMethod]
        public async Task WhenNoEmailRecipientIsFoundThenEmailIsNotSent()
        {
            var resultItems = new List<SmartSignalResultItemPresentation>
            {
                new SmartSignalResultItemPresentation("id", "title", null, "resource", null, "someSignalId", string.Empty, DateTime.UtcNow, 0, null, null, null, null)
            };

            this.signalExecutionInfo.AlertRule.EmailRecipients = new List<string>();
            await this.emailSender.SendSignalResultEmailAsync(this.signalExecutionInfo, resultItems);
            this.sendgridClientMock.Verify(m => m.SendEmailAsync(It.IsAny<SendGridMessage>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [TestMethod]
        [ExpectedException(typeof(EmailSendingException))]
        public async Task WhenSendGridClientRerturnsFailStatusCodeThenExceptionIsThrown()
        {
            this.sendgridClientMock
                .Setup(m => m.SendEmailAsync(It.IsAny<SendGridMessage>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new Response(HttpStatusCode.GatewayTimeout, null, null));

            var resultItems = this.CreateSignalResultList();
            await this.emailSender.SendSignalResultEmailAsync(this.signalExecutionInfo, resultItems);

            this.sendgridClientMock.Verify(m => m.SendEmailAsync(It.Is<SendGridMessage>(message => message.From.Email.Equals("smartsignals@microsoft.com")), It.IsAny<CancellationToken>()), Times.Once);
        }

        [TestMethod]
        public async Task WhenResultItemsAreFoundThenEmailIsSent()
        {
            this.sendgridClientMock
                .Setup(m => m.SendEmailAsync(It.IsAny<SendGridMessage>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new Response(HttpStatusCode.Accepted, null, null));

            var resultItems = this.CreateSignalResultList();
            await this.emailSender.SendSignalResultEmailAsync(this.signalExecutionInfo, resultItems);

            this.sendgridClientMock.Verify(m => m.SendEmailAsync(It.Is<SendGridMessage>(message => message.From.Email.Equals("smartsignals@microsoft.com")), It.IsAny<CancellationToken>()), Times.Once);
        }

        private List<SmartSignalResultItemPresentation> CreateSignalResultList()
        {
            return new List<SmartSignalResultItemPresentation>
            {
                new SmartSignalResultItemPresentation("id", "title", null, "resource", null, "someSignalId", string.Empty, DateTime.UtcNow, 0, null, null, null, null)
            };
        }
    }
}
