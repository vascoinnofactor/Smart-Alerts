﻿//-----------------------------------------------------------------------
// <copyright file="ScheduleFlowTest.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalSchedulerTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AlertRules;
    using Microsoft.Azure.Monitoring.SmartSignals.Scheduler;
    using Microsoft.Azure.Monitoring.SmartSignals.Scheduler.Publisher;
    using Microsoft.Azure.Monitoring.SmartSignals.Scheduler.SignalRunTracker;
    using Microsoft.Azure.Monitoring.SmartSignals.SignalResultPresentation;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;

    [TestClass]
    public class ScheduleFlowTest
    {
        private Mock<IAlertRuleStore> alertRuleStoreMock;
        private Mock<ISignalRunsTracker> signalRunTrackerMock;
        private Mock<IAnalysisExecuter> analysisExecuterMock;
        private Mock<ISmartSignalResultPublisher> publisherMock;
        private Mock<IEmailSender> emailSenderMock;

        private ScheduleFlow scheduleFlow;

        [TestInitialize]
        public void Setup()
        {
            var tracerMock = new Mock<ITracer>();
            this.alertRuleStoreMock = new Mock<IAlertRuleStore>();
            this.signalRunTrackerMock = new Mock<ISignalRunsTracker>();
            this.analysisExecuterMock = new Mock<IAnalysisExecuter>();
            this.publisherMock = new Mock<ISmartSignalResultPublisher>();
            this.emailSenderMock = new Mock<IEmailSender>();

            this.scheduleFlow = new ScheduleFlow(
                tracerMock.Object,
                this.alertRuleStoreMock.Object,
                this.signalRunTrackerMock.Object,
                this.analysisExecuterMock.Object,
                this.publisherMock.Object,
                this.emailSenderMock.Object);
        }

        [TestMethod]
        public async Task WhenSignalExecutionThrowsExceptionThenNextSignalIsProcessed()
        {
            // Create signal execution information to be returned from the job tracker
            var signalExecution1 = new SignalExecutionInfo
            {
                AlertRule = new AlertRule
                {
                    SignalId = "s1",
                    Id = "r1",
                    ResourceId = "1",
                },
                LastExecutionTime = DateTime.UtcNow.AddHours(-1)
            };
            var signalExecution2 = new SignalExecutionInfo
            {
                AlertRule = new AlertRule
                {
                    SignalId = "s2",
                    Id = "r2",
                    ResourceId = "2",
                },
                LastExecutionTime = DateTime.UtcNow.AddHours(-1)
            };
            var signalExecutions = new List<SignalExecutionInfo> { signalExecution1, signalExecution2 };

            this.signalRunTrackerMock.Setup(m => m.GetSignalsToRunAsync(It.IsAny<IList<AlertRule>>())).ReturnsAsync(signalExecutions);

            // first signal execution throws exception and the second one returns a result
            const string ResultItemTitle = "someTitle";
            this.analysisExecuterMock.SetupSequence(m => m.ExecuteSignalAsync(It.IsAny<SignalExecutionInfo>(), It.Is<IList<string>>(lst => lst.First() == "1" || lst.First() == "2")))
                .Throws(new Exception())
                .ReturnsAsync(new List<SmartSignalResultItemPresentation> { new TestResultItem(ResultItemTitle) });

            await this.scheduleFlow.RunAsync();

            this.alertRuleStoreMock.Verify(m => m.GetAllAlertRulesAsync(), Times.Once);
            
            // Verify that these were called only once since the first signal execution throwed exception
            this.publisherMock.Verify(m => m.PublishSignalResultItemsAsync("s2", It.Is<IList<SmartSignalResultItemPresentation>>(items => items.Count == 1 && items.First().Title == ResultItemTitle)), Times.Once);
            this.emailSenderMock.Verify(m => m.SendSignalResultEmailAsync(It.IsAny<SignalExecutionInfo>(), It.Is<IList<SmartSignalResultItemPresentation>>(items => items.Count == 1 && items.First().Title == ResultItemTitle)), Times.Once);
            this.signalRunTrackerMock.Verify(m => m.UpdateSignalRunAsync(It.IsAny<SignalExecutionInfo>()), Times.Once());
            this.signalRunTrackerMock.Verify(m => m.UpdateSignalRunAsync(signalExecution2));
        }

        [TestMethod]
        public async Task WhenThereAreSignalsToRunThenAllSiganlResultItemsArePublished()
        {
            // Create signal execution information to be returned from the job tracker
            var signalExecution1 = new SignalExecutionInfo
            {
                AlertRule = new AlertRule
                {
                    Id = "r1",
                    SignalId = "s1",
                    ResourceId = "1",
                },
                LastExecutionTime = DateTime.UtcNow.AddHours(-1)
            };
            var signalExecution2 = new SignalExecutionInfo
            {
                AlertRule = new AlertRule
                {
                    Id = "r2",
                    SignalId = "s2",
                    ResourceId = "2",
                },
                LastExecutionTime = DateTime.UtcNow.AddHours(-1)
            };
            var signalExecutions = new List<SignalExecutionInfo> { signalExecution1, signalExecution2 };

            this.signalRunTrackerMock.Setup(m => m.GetSignalsToRunAsync(It.IsAny<IList<AlertRule>>())).ReturnsAsync(signalExecutions);

            // each signal execution returns a result
            this.analysisExecuterMock.Setup(m => m.ExecuteSignalAsync(It.IsAny<SignalExecutionInfo>(), It.Is<IList<string>>(lst => lst.First() == "1" || lst.First() == "2")))
                .ReturnsAsync(new List<SmartSignalResultItemPresentation> { new TestResultItem("title") });

            await this.scheduleFlow.RunAsync();

            // Verify result items were published and signal tracker was updated for each signal execution
            this.alertRuleStoreMock.Verify(m => m.GetAllAlertRulesAsync(), Times.Once);
            this.publisherMock.Verify(m => m.PublishSignalResultItemsAsync(It.IsAny<string>(), It.IsAny<IList<SmartSignalResultItemPresentation>>()), Times.Exactly(2));
            this.emailSenderMock.Verify(m => m.SendSignalResultEmailAsync(It.IsAny<SignalExecutionInfo>(), It.IsAny<IList<SmartSignalResultItemPresentation>>()), Times.Exactly(2));
            this.signalRunTrackerMock.Verify(m => m.UpdateSignalRunAsync(It.IsAny<SignalExecutionInfo>()), Times.Exactly(2));
        }

        private class TestResultItem : SmartSignalResultItemPresentation
        {
            public TestResultItem(string title) : base(title, title, null, null, null, null, null, DateTime.UtcNow, 0, null, null, null)
            {
            }
        }
    }
}
