﻿//-----------------------------------------------------------------------
// <copyright file="SignalApiTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace ManagementApiTests.EndpointsLogic
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartAlerts;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.EndpointsLogic;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.ManagementApi.Responses;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.RuntimeShared;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.RuntimeShared.Exceptions;
    using Microsoft.Azure.Monitoring.SmartAlerts.Package;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;

    [TestClass]
    public class SignalApiTests
    {
        private Mock<ISmartSignalRepository> smartSignalsRepository;

        private ISignalApi signalsLogic;

        [TestInitialize]
        public void Initialize()
        {
            this.smartSignalsRepository = new Mock<ISmartSignalRepository>();
            this.signalsLogic = new SignalApi(this.smartSignalsRepository.Object);
        }

        #region Getting Signals Tests

        [TestMethod]
        public async Task WhenGettingAllSignalsHappyFlow()
        {
            this.smartSignalsRepository.Setup(repository => repository.ReadAllSignalsManifestsAsync(It.IsAny<CancellationToken>()))
                                       .ReturnsAsync(() => new List<SmartSignalManifest>()
                {
                    new SmartSignalManifest("someId", "someName", "someDescription", Version.Parse("1.0"), "someAssemblyName", "someClassName", new List<ResourceType> { ResourceType.ResourceGroup }, new List<int> { 60 })
                });

            ListSmartSignalsResponse response = await this.signalsLogic.GetAllSmartSignalsAsync(CancellationToken.None);

            Assert.AreEqual(1, response.Signals.Count);
            Assert.AreEqual("someId", response.Signals.First().Id);
            Assert.AreEqual("someName", response.Signals.First().Name);
        }

        [TestMethod]
        public async Task WhenGettingAllSignalsButSignalsRepositoryThrowsExceptionThenThrowsWrappedException()
        {
            this.smartSignalsRepository.Setup(repository => repository.ReadAllSignalsManifestsAsync(It.IsAny<CancellationToken>()))
                                       .ThrowsAsync(new AlertRuleStoreException("some message", new Exception()));

            try
            {
                await this.signalsLogic.GetAllSmartSignalsAsync(CancellationToken.None);
            }
            catch (SmartSignalsManagementApiException)
            {
                return;
            }

            Assert.Fail("Exception from the signals store should cause to management API exception");
        }

        #endregion
    }
}
