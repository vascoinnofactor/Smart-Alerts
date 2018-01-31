﻿//-----------------------------------------------------------------------
// <copyright file="QueryRunInfoProviderTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalsAnalysisTests
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.Clients;
    using Microsoft.Azure.Monitoring.SmartSignals.SignalResultPresentation;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;

    [TestClass]
    public class QueryRunInfoProviderTests
    {
        private const string SubscriptionId = "subscriptionId";
        private const string ResourceGroupName = "resourceGroupName";
        private const string ResourceName = "resourceName";
        private const string ApplicationId = "applicationId";
        private static readonly List<string> WorkspaceIds = new List<string>() { "workspaceId1", "workspaceId2", "workspaceId3" };
        private static readonly List<string> WorkspaceNames = new List<string>() { "workspaceName1", "workspaceName2", "workspaceName3" };
        private static readonly List<ResourceIdentifier> Workspaces = WorkspaceNames.Select(name => ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId, ResourceGroupName, name)).ToList();

        private Mock<IAzureResourceManagerClient> azureResourceManagerClientMock;

        [TestInitialize]
        public void TestInitialize()
        {
            this.azureResourceManagerClientMock = new Mock<IAzureResourceManagerClient>();
            this.azureResourceManagerClientMock
                .Setup(x => x.GetApplicationInsightsAppIdAsync(It.Is<ResourceIdentifier>(identifier => identifier.ResourceType == ResourceType.ApplicationInsights), It.IsAny<CancellationToken>()))
                .ReturnsAsync(ApplicationId);
            this.azureResourceManagerClientMock
                .Setup(x => x.GetLogAnalyticsWorkspaceIdAsync(It.Is<ResourceIdentifier>(identifier => identifier.ResourceType == ResourceType.LogAnalytics), It.IsAny<CancellationToken>()))
                .ReturnsAsync((ResourceIdentifier resourceIdentifier, CancellationToken cancellationToken) =>
                {
                    int idx = WorkspaceNames.FindIndex(name => name == resourceIdentifier.ResourceName);
                    return WorkspaceIds[idx];
                });
            this.azureResourceManagerClientMock
                .Setup(x => x.GetAllResourcesInSubscriptionAsync(SubscriptionId, It.IsAny<IEnumerable<ResourceType>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(Workspaces);
            this.azureResourceManagerClientMock
                .Setup(x => x.GetResourceId(It.IsAny<ResourceIdentifier>()))
                .Returns((ResourceIdentifier resourceIdentifier) => resourceIdentifier.ResourceName);
        }

        [TestMethod]
        public async Task WhenCreatingQueryRunInfoForApplicationInsightsResourcesThenTheCorrectInfoIsCreated()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.ApplicationInsights, SubscriptionId, ResourceGroupName, ResourceName)
            };

            IQueryRunInfoProvider provider = new QueryRunInfoProvider(this.azureResourceManagerClientMock.Object);

            SmartSignalResultItemQueryRunInfo queryRunInfo = await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));

            Assert.IsNotNull(queryRunInfo, "Query run information is null");
            Assert.AreEqual(TelemetryDbType.ApplicationInsights, queryRunInfo.Type, "Wrong telemetry DB type");
            CollectionAssert.AreEqual(new[] { ResourceName }, queryRunInfo.ResourceIds.ToArray(), "Wrong resource IDs");
        }

        [TestMethod]
        public async Task WhenCreatingQueryRunInfoForMixedResourcesThenAnExceptionIsThrown()
        {
            IQueryRunInfoProvider provider = new QueryRunInfoProvider(this.azureResourceManagerClientMock.Object);

            try
            {
                var resources = new List<ResourceIdentifier>()
                {
                    ResourceIdentifier.Create(ResourceType.ApplicationInsights, SubscriptionId, ResourceGroupName, ResourceName + "111"),
                    ResourceIdentifier.Create(ResourceType.VirtualMachine, SubscriptionId, ResourceGroupName, ResourceName)
                };

                await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));
                Assert.Fail("An exception should be thrown");
            }
            catch (QueryClientInfoProviderException)
            {
            }

            try
            {
                var resources = new List<ResourceIdentifier>()
                {
                    ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId, ResourceGroupName, WorkspaceNames[0]),
                    ResourceIdentifier.Create(ResourceType.ApplicationInsights, SubscriptionId, ResourceGroupName, ResourceName)
                };

                await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));
                Assert.Fail("An exception should be thrown");
            }
            catch (QueryClientInfoProviderException)
            {
            }
        }

        [TestMethod]
        public async Task WhenCreatingQueryRunInfoForLogAnalyticsResourcesThenTheCorrectInfoIsCreated()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId, ResourceGroupName, WorkspaceNames[0]),
                ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId, ResourceGroupName, WorkspaceNames[1])
            };

            IQueryRunInfoProvider provider = new QueryRunInfoProvider(this.azureResourceManagerClientMock.Object);
            SmartSignalResultItemQueryRunInfo queryRunInfo = await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));

            Assert.IsNotNull(queryRunInfo, "Query run information is null");
            Assert.AreEqual(TelemetryDbType.LogAnalytics, queryRunInfo.Type, "Wrong telemetry DB type");
            CollectionAssert.AreEqual(new[] { WorkspaceNames[0], WorkspaceNames[1] }, queryRunInfo.ResourceIds.ToArray(), "Wrong resource IDs");
        }

        [TestMethod]
        public async Task WhenCreatingQueryRunInfoGeneralResourcesThenAllWorkspacesAreUsed()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId, ResourceGroupName, WorkspaceNames[0]),
                ResourceIdentifier.Create(ResourceType.VirtualMachine, SubscriptionId, ResourceGroupName, ResourceName)
            };

            IQueryRunInfoProvider provider = new QueryRunInfoProvider(this.azureResourceManagerClientMock.Object);
            SmartSignalResultItemQueryRunInfo queryRunInfo = await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));

            Assert.IsNotNull(queryRunInfo, "Query run information is null");
            Assert.AreEqual(TelemetryDbType.LogAnalytics, queryRunInfo.Type, "Wrong telemetry DB type");
            CollectionAssert.AreEqual(WorkspaceNames, queryRunInfo.ResourceIds.ToArray(), "Wrong resource IDs");
        }

        [TestMethod]
        [ExpectedException(typeof(QueryClientInfoProviderException))]
        public async Task WhenCreatingQueryRunInfoForEmptyResourcesThenAnExceptionIsThrown()
        {
            IQueryRunInfoProvider provider = new QueryRunInfoProvider(this.azureResourceManagerClientMock.Object);
            await provider.GetQueryRunInfoAsync(new List<ResourceIdentifier>(), default(CancellationToken));
        }

        [TestMethod]
        public async Task WhenCreatingQueryRunInfoForResourcesWithMultipleSubscriptionsThenAllWorkspacesAreReturned()
        {
            var resources = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.VirtualMachine, SubscriptionId + "1", ResourceGroupName + "1", ResourceName + "1"),
                ResourceIdentifier.Create(ResourceType.VirtualMachine, SubscriptionId + "2", ResourceGroupName + "2", ResourceName + "2")
            };

            var workspaces = new List<ResourceIdentifier>()
            {
                ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId + "1", ResourceGroupName + "1", ResourceName + "1"),
                ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId + "2", ResourceGroupName + "2", ResourceName + "2"),
                ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId + "2", ResourceGroupName + "2", ResourceName + "3")
            };

            this.azureResourceManagerClientMock
                .Setup(x => x.GetAllResourcesInSubscriptionAsync(SubscriptionId + "1", It.IsAny<IEnumerable<ResourceType>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<ResourceIdentifier>() { workspaces[0] });
            this.azureResourceManagerClientMock
                .Setup(x => x.GetAllResourcesInSubscriptionAsync(SubscriptionId + "2", It.IsAny<IEnumerable<ResourceType>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<ResourceIdentifier>() { workspaces[1], workspaces[2] });
            this.azureResourceManagerClientMock
                .Setup(x => x.GetLogAnalyticsWorkspaceIdAsync(It.Is<ResourceIdentifier>(identifier => identifier.ResourceType == ResourceType.LogAnalytics), It.IsAny<CancellationToken>()))
                .ReturnsAsync("workspaceId");

            IQueryRunInfoProvider provider = new QueryRunInfoProvider(this.azureResourceManagerClientMock.Object);
            SmartSignalResultItemQueryRunInfo queryRunInfo = await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));

            Assert.IsNotNull(queryRunInfo, "Query run information is null");
            this.azureResourceManagerClientMock.Verify(x => x.GetAllResourcesInSubscriptionAsync(SubscriptionId + "1", It.IsAny<IEnumerable<ResourceType>>(), It.IsAny<CancellationToken>()), Times.Once);
            this.azureResourceManagerClientMock.Verify(x => x.GetAllResourcesInSubscriptionAsync(SubscriptionId + "2", It.IsAny<IEnumerable<ResourceType>>(), It.IsAny<CancellationToken>()), Times.Once);
            CollectionAssert.AreEqual(workspaces.Select(x => x.ResourceName).ToList(), queryRunInfo.ResourceIds.ToArray().ToArray());
        }

        [TestMethod]
        public async Task WhenCreatingQueryRunInfoForTooManyResourcesThenAnExceptionIsThrown()
        {
            const int TooManyResourcesCount = 11;
            IQueryRunInfoProvider provider = new QueryRunInfoProvider(this.azureResourceManagerClientMock.Object);

            try
            {
                List<ResourceIdentifier> resources = Enumerable.Range(1, TooManyResourcesCount)
                    .Select(i => ResourceIdentifier.Create(ResourceType.ApplicationInsights, SubscriptionId + i, ResourceGroupName + i, ResourceName + i)).ToList();
                await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));
                Assert.Fail("An exception should be thrown");
            }
            catch (QueryClientInfoProviderException)
            {
            }

            try
            {
                List<ResourceIdentifier> resources = Enumerable.Range(1, TooManyResourcesCount)
                    .Select(i => ResourceIdentifier.Create(ResourceType.LogAnalytics, SubscriptionId + i, ResourceGroupName + i, ResourceName + i)).ToList();
                await provider.GetQueryRunInfoAsync(resources, default(CancellationToken));
                Assert.Fail("An exception should be thrown");
            }
            catch (QueryClientInfoProviderException)
            {
            }
        }
    }
}