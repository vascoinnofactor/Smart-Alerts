﻿//-----------------------------------------------------------------------
// <copyright file="AlertRuleStoreTest.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalsRuntimeSharedTests
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AlertRules;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Microsoft.WindowsAzure.Storage.Table;
    using Moq;
    using NCrontab;
    using Newtonsoft.Json;

    [TestClass]
    public class AlertRuleStoreTest
    {
        private AlertRuleStore alertRuleStore;
        private Mock<ICloudTableWrapper> tableMock;

        [TestInitialize]
        public void Setup()
        {
            this.tableMock = new Mock<ICloudTableWrapper>();
            var tableClientMock = new Mock<ICloudTableClientWrapper>();
            tableClientMock.Setup(m => m.GetTableReference(It.IsAny<string>())).Returns(this.tableMock.Object);
            var storageProviderFactoryMock = new Mock<ICloudStorageProviderFactory>();
            storageProviderFactoryMock.Setup(m => m.GetSmartSignalStorageTableClient()).Returns(tableClientMock.Object);

            var tracerMock = new Mock<ITracer>();
            this.alertRuleStore = new AlertRuleStore(storageProviderFactoryMock.Object, tracerMock.Object);
        }

        [TestMethod]
        public async Task WhenUpdatingAlertRuleThenUpdateIsCalledCorrectly()
        {
            const string CronSchedule = "0 1 * * *";

            var ruleToUpdate = new AlertRule
            {
                Id = "ruleId",
                SignalId = "signalId",
                Schedule = CrontabSchedule.Parse(CronSchedule),
                ResourceId = "resourceId"
            };

            await this.alertRuleStore.AddOrReplaceAlertRuleAsync(ruleToUpdate, CancellationToken.None);

            this.tableMock.Verify(m => m.ExecuteAsync(
                It.Is<TableOperation>(operation =>
                    operation.OperationType == TableOperationType.InsertOrReplace &&
                    operation.Entity.RowKey.Equals(ruleToUpdate.Id) &&
                    ((AlertRuleEntity)operation.Entity).SignalId.Equals(ruleToUpdate.SignalId) &&
                    ((AlertRuleEntity)operation.Entity).CrontabSchedule.Equals(CronSchedule) &&
                    ((AlertRuleEntity)operation.Entity).ResourceId.Equals(ruleToUpdate.ResourceId)),
                It.IsAny<CancellationToken>()));
        }

        [TestMethod]
        public async Task WhenGettingAllAlertRulesThenTableIsCalledCorrectly()
        {
            // Create rules entites in the table
            var ruleEntities = new List<AlertRuleEntity>
            {
                new AlertRuleEntity
                {
                    RowKey = "rule1",
                    SignalId = "signal1",
                    CrontabSchedule = "0 0 * * *",
                    ResourceId = "resourceId1"
                },
                new AlertRuleEntity
                {
                    RowKey = "rule2",
                    SignalId = "signal2",
                    CrontabSchedule = "0 * * * *",
                    ResourceId = "resourceId2"
                }
            };

            this.tableMock.Setup(m => m.ReadPartitionAsync<AlertRuleEntity>("rules")).ReturnsAsync(ruleEntities);

            var returnedRules = await this.alertRuleStore.GetAllAlertRulesAsync();
            Assert.AreEqual(2, returnedRules.Count);

            var firstRule = returnedRules.First();
            Assert.AreEqual("rule1", firstRule.Id);
            Assert.AreEqual("signal1", firstRule.SignalId);
            Assert.AreEqual("0 0 * * *", firstRule.Schedule.ToString());
            Assert.AreEqual("resourceId1", firstRule.ResourceId);

            var lastRule = returnedRules.Last();
            Assert.AreEqual("rule2", lastRule.Id);
            Assert.AreEqual("signal2", lastRule.SignalId);
            Assert.AreEqual("0 * * * *", lastRule.Schedule.ToString());
            Assert.AreEqual("resourceId2", lastRule.ResourceId);
        }
    }
}