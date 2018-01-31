﻿//-----------------------------------------------------------------------
// <copyright file="ApplicationInsightsClientTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace ManagementApiTests.AIClient
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.Clients;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.AIClient;
    using Microsoft.Azure.Monitoring.SmartSignals.ManagementApi.Extensions;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;
    using SmartSignalsSharedTests;

    [TestClass]
    public class ApplicationInsightsClientTests
    {
        private const string ApplicationId = "someApplicationId";
        private const string EventName = "eventName";

        private Mock<IHttpClientWrapper> httpClientMock;
        private Mock<ICredentialsFactory> credentialsFactoryMock;
        private IApplicationInsightsClient applicationInsightsClient;

        [TestInitialize]
        public void Initialize()
        {
            this.httpClientMock = new Mock<IHttpClientWrapper>();
            this.credentialsFactoryMock = new Mock<ICredentialsFactory>();
            this.credentialsFactoryMock.Setup(cf => cf.Create(It.IsAny<string>())).Returns(new EmptyCredentials());

            this.applicationInsightsClient = new ApplicationInsightsClient(ApplicationId, this.httpClientMock.Object, this.credentialsFactoryMock.Object);
        }

        [TestMethod]
        public async Task WhenQueryApplicationInsightsForCustomEventsHappyFlow()
        {
            HttpRequestMessage requestMessage = null;

            // Configure mock to return the successful response
            this.httpClientMock.Setup(h => h.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .Callback<HttpRequestMessage, CancellationToken>((message, token) => requestMessage = message)
                .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
                              {
                                Content = new StringContent(File.ReadAllText("AIClient\\AIEndpointResponses\\SuccessfulResponse.txt"))
                              });

            // Get data using AI client
            var customEvents = await this.applicationInsightsClient.GetCustomEventsAsync(EventName);

            // Verify we got the required amount of events
            Assert.AreEqual(10, customEvents.Count());

            // Verify the executed url was the correct one
            Assert.AreEqual($"https://api.applicationinsights.io/v1/apps/someApplicationId/events/customEvents?$filter=customEvent/name eq '{EventName}'", requestMessage.RequestUri.ToString());
        }

        [TestMethod]
        public async Task WhenQueryApplicationInsightForCustomEventsWithStartTimeThenCorrectRequestRaised()
        {
            HttpRequestMessage requestMessage = null;
            DateTime queryStartTime = DateTime.UtcNow.AddDays(-1);

            // Configure mock to return the successful response
            this.httpClientMock.Setup(h => h.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .Callback<HttpRequestMessage, CancellationToken>((message, token) => requestMessage = message)
                .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(File.ReadAllText("AIClient\\AIEndpointResponses\\SuccessfulResponse.txt"))
                });

            // Get data using AI client
            var customEvents = await this.applicationInsightsClient.GetCustomEventsAsync(EventName, queryStartTime);

            // Verify we got the required amount of events
            Assert.AreEqual(10, customEvents.Count());

            // Verify the executed url was the correct one
            Assert.AreEqual(
                   $"https://api.applicationinsights.io/v1/apps/someApplicationId/events/customEvents?$filter=customEvent/name eq '{EventName}' and timestamp ge {queryStartTime.ToQueryTimeFormat()}", 
                   requestMessage.RequestUri.ToString());
        }

        [TestMethod]
        public async Task WhenQueryApplicationInsightForCustomEventsWithStartTimeAndEndTimeThenCorrectRequestRaised()
        {
            HttpRequestMessage requestMessage = null;
            DateTime queryStartTime = DateTime.UtcNow.AddDays(-1);
            DateTime queryEndTime = DateTime.UtcNow;

            // Configure mock to return the successful response
            this.httpClientMock.Setup(h => h.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .Callback<HttpRequestMessage, CancellationToken>((message, token) => requestMessage = message)
                .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(File.ReadAllText("AIClient\\AIEndpointResponses\\SuccessfulResponse.txt"))
                });

            // Get data using AI client
            var customEvents = await this.applicationInsightsClient.GetCustomEventsAsync(EventName, queryStartTime, queryEndTime);

            // Verify we got the required amount of events
            Assert.AreEqual(10, customEvents.Count());

            // Verify the executed url was the correct one
            Assert.AreEqual(
                   $"https://api.applicationinsights.io/v1/apps/someApplicationId/events/customEvents?$filter=customEvent/name eq '{EventName}' and timestamp ge {queryStartTime.ToQueryTimeFormat()} and timestamp le {queryEndTime.ToQueryTimeFormat()}",
                   requestMessage.RequestUri.ToString());
        }

        [TestMethod]
        public async Task WhenQueryApplicationInsightForCustomEventsWithStartTimeAndEndTimeButEndTimeIsBeforeStartTimeThenExceptionThrown()
        {
            DateTime queryStartTime = DateTime.UtcNow;
            DateTime queryEndTime = DateTime.UtcNow.AddDays(-1);

            // Configure mock to return the successful response
            this.httpClientMock.Setup(h => h.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(File.ReadAllText("AIClient\\AIEndpointResponses\\SuccessfulResponse.txt"))
                });

            try
            {
                // Get data using AI client
                await this.applicationInsightsClient.GetCustomEventsAsync(EventName, queryStartTime, queryEndTime);
            }
            catch (ArgumentOutOfRangeException)
            {
                return;
            }

            Assert.Fail("End time is after Start time and therfore it should have throw an exception");
        }

        [TestMethod]
        public async Task WhenQueryApplicationInsightForCustomEventsButEndpointReturnsCorruptedResultsThenExceptionThrown()
        {
            // Configure mock to return the successful response
            this.httpClientMock.Setup(h => h.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent("Corrupted Result")
                });

            try
            {
                // Get data using AI client
                await this.applicationInsightsClient.GetCustomEventsAsync(EventName);
            }
            catch (ApplicationInsightsClientException)
            {
                return;
            }
            
            Assert.Fail("Corrupted results should throw an exception");
        }

        [TestMethod]
        public async Task WhenQueryApplicationInsightForCustomEventsButEndpointReturnsNotSuccessStatusCodeThenExceptionThrownWithResponseContent()
        {
            // Configure mock to return the successful response
            this.httpClientMock.Setup(h => h.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("Response content")
                });

            try
            {
                // Get data using AI client
                await this.applicationInsightsClient.GetCustomEventsAsync(EventName);
            }
            catch (ApplicationInsightsClientException e)
            {
                Assert.IsTrue(e.Message.Contains("Response content"));

                return;
            }

            Assert.Fail("Not success status code should throw an exception");
        }

        [TestMethod]
        public async Task WhenQueryApplicationInsightForCustomEventsButHttpClientThrowsExceptionTheWrappedExceptionThrown()
        {
            // Configure mock to return the successful response
            this.httpClientMock.Setup(h => h.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new HttpRequestException());

            try
            {
                // Get data using AI client
                await this.applicationInsightsClient.GetCustomEventsAsync(EventName);
            }
            catch (ApplicationInsightsClientException)
            {
                return;
            }

            Assert.Fail("When HttpClient throws an exception then the client should throw an exception");
        }
    }
}
