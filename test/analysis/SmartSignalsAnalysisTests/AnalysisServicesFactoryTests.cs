﻿//-----------------------------------------------------------------------
// <copyright file="AnalysisServicesFactoryTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalsAnalysisTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.Analysis;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.HttpClient;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.SignalResultPresentation;
    using Microsoft.Azure.Monitoring.SmartSignals.Shared;
    using Microsoft.Azure.Monitoring.SmartSignals.Shared.AzureResourceManagerClient;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;

    [TestClass]
    public class AnalysisServicesFactoryTests
    {
        private const string SubscriptionId = "subscriptionId";
        private const string ResourceGroupName = "resourceGroupName";
        private const string ResourceName = "resourceName";
        private const string ApplicationId = "applicationId";
        private const string WorkspaceId = "workspaceId";

        private Mock<ITracer> tracerMock;
        private Mock<ICredentialsFactory> credentialsFactoryMock;
        private Mock<IHttpClientWrapper> httpClientWrapperMock;
        private Mock<IAzureResourceManagerClient> azureResourceManagerClientMock;
        private Mock<IQueryRunInfoProvider> queryRunInfoProviderMock;

        [TestInitialize]
        public void TestInitialize()
        {
            this.tracerMock = new Mock<ITracer>();
            this.credentialsFactoryMock = new Mock<ICredentialsFactory>();
            this.httpClientWrapperMock = new Mock<IHttpClientWrapper>();
            this.azureResourceManagerClientMock = new Mock<IAzureResourceManagerClient>();
            this.queryRunInfoProviderMock = new Mock<IQueryRunInfoProvider>();

            this.azureResourceManagerClientMock
                .Setup(x => x.GetResourceId(It.IsAny<ResourceIdentifier>()))
                .Returns((ResourceIdentifier r) => r.ResourceName);

            Environment.SetEnvironmentVariable("APPSETTING_AnalyticsQueryTimeoutInMinutes", "15");
        }

        [TestMethod]
        public async Task WhenCreatingApplicationInsightsClientForTheCorrectRunInfoThenTheCorrectClientIsCreated()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.ApplicationInsights, SubscriptionId, ResourceGroupName, ResourceName)
            };

            this.SetupTest(resources, TelemetryDbType.ApplicationInsights, ApplicationId);

            IAnalysisServicesFactory factory = new AnalysisServicesFactory(this.tracerMock.Object, this.httpClientWrapperMock.Object, this.credentialsFactoryMock.Object, this.azureResourceManagerClientMock.Object, this.queryRunInfoProviderMock.Object);
            TelemetryDataClientBase client = await factory.CreateApplicationInsightsTelemetryDataClientAsync(resources, default(CancellationToken)) as TelemetryDataClientBase;

            Assert.IsNotNull(client);
            Assert.AreEqual(typeof(ApplicationInsightsTelemetryDataClient), client.GetType(), "Wrong telemetry data client type created");
            Assert.AreEqual(ApplicationId, client.MainTelemetryDbId, "Wrong application Id");
            CollectionAssert.AreEqual(new[] { ResourceName }, client.TelemetryResourceIds.ToArray(), "Wrong resource Ids");
        }

        [TestMethod]
        public async Task WhenCreatingLogAnalyticsClientForTheCorrectRunInfoThenTheCorrectClientIsCreated()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.VirtualMachine, SubscriptionId, ResourceGroupName, ResourceName)
            };

            this.SetupTest(resources, TelemetryDbType.LogAnalytics, WorkspaceId);

            IAnalysisServicesFactory factory = new AnalysisServicesFactory(this.tracerMock.Object, this.httpClientWrapperMock.Object, this.credentialsFactoryMock.Object, this.azureResourceManagerClientMock.Object, this.queryRunInfoProviderMock.Object);
            TelemetryDataClientBase client = await factory.CreateLogAnalyticsTelemetryDataClientAsync(resources, default(CancellationToken)) as TelemetryDataClientBase;

            Assert.IsNotNull(client);
            Assert.AreEqual(typeof(LogAnalyticsTelemetryDataClient), client.GetType(), "Wrong telemetry data client type created");
            Assert.AreEqual(WorkspaceId, client.MainTelemetryDbId, "Wrong application Id");
            CollectionAssert.AreEqual(new[] { ResourceName }, client.TelemetryResourceIds.ToArray(), "Wrong resource Ids");
        }

        [TestMethod]
        [ExpectedException(typeof(TelemetryDataClientCreationException))]
        public async Task WhenCreatingApplicationInsightsClientForRunInfoWithWrongTypeThenAnExceptionIsThrown()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.VirtualMachine, SubscriptionId, ResourceGroupName, ResourceName)
            };

            this.SetupTest(resources, TelemetryDbType.LogAnalytics, WorkspaceId);

            IAnalysisServicesFactory factory = new AnalysisServicesFactory(this.tracerMock.Object, this.httpClientWrapperMock.Object, this.credentialsFactoryMock.Object, this.azureResourceManagerClientMock.Object, this.queryRunInfoProviderMock.Object);
            await factory.CreateApplicationInsightsTelemetryDataClientAsync(resources, default(CancellationToken));
        }

        [TestMethod]
        [ExpectedException(typeof(TelemetryDataClientCreationException))]
        public async Task WhenCreatingLogAnalyticsClientForRunInfoWithWrongTypeThenAnExceptionIsThrown()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.ApplicationInsights, SubscriptionId, ResourceGroupName, ResourceName)
            };

            this.SetupTest(resources, TelemetryDbType.ApplicationInsights, ApplicationId);

            IAnalysisServicesFactory factory = new AnalysisServicesFactory(this.tracerMock.Object, this.httpClientWrapperMock.Object, this.credentialsFactoryMock.Object, this.azureResourceManagerClientMock.Object, this.queryRunInfoProviderMock.Object);
            await factory.CreateLogAnalyticsTelemetryDataClientAsync(resources, default(CancellationToken));
        }

        private void SetupTest(List<ResourceIdentifier> resources, TelemetryDbType telemetryDbType, string id)
        {
            this.queryRunInfoProviderMock
                .Setup(x => x.GetQueryRunInfoAsync(It.Is<IReadOnlyList<ResourceIdentifier>>(y => y.SequenceEqual(resources)), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new SmartSignalResultItemQueryRunInfo(telemetryDbType, resources.Select(r => r.ResourceName).ToList()));
            this.azureResourceManagerClientMock
                .Setup(x => x.GetResourceIdentifier(It.Is<string>(s => s == ResourceName)))
                .Returns(() => resources[0]);
            if (telemetryDbType == TelemetryDbType.ApplicationInsights)
            {
                this.azureResourceManagerClientMock
                    .Setup(x => x.GetApplicationInsightsAppIdAsync(It.Is<ResourceIdentifier>(r => r == resources[0]), It.IsAny<CancellationToken>()))
                    .ReturnsAsync(() => id);
            }
            else
            {
                this.azureResourceManagerClientMock
                    .Setup(x => x.GetLogAnalyticsWorkspaceIdAsync(It.Is<ResourceIdentifier>(r => r == resources[0]), It.IsAny<CancellationToken>()))
                    .ReturnsAsync(() => id);
            }
        }
    }
}