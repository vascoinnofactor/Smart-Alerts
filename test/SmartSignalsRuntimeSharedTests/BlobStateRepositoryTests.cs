//-----------------------------------------------------------------------
// <copyright file="BlobStateRepositoryTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalsRuntimeSharedTests
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage.State;
    using Microsoft.Azure.Monitoring.SmartSignals.State;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    using Moq;

    [TestClass]
    public class BlobStateRepositoryTests
    {
        [TestMethod]
        public async Task WhenExecutingBasigStateActionsThenFlowCompletesSuccesfully()
        {
            Dictionary<string, string> repository = new Dictionary<string, string>();
            Mock<ICloudBlobContainerWrapper> cloudBlobContainerWrapperMock = new Mock<ICloudBlobContainerWrapper>();
            cloudBlobContainerWrapperMock
                .Setup(m => m.UploadBlobAsync(It.IsAny<string>(), It.IsAny<string>(), CancellationToken.None))
                .Returns<string, string, CancellationToken>((blobName, blobContent, token) => { repository[blobName] = blobContent; return Task.FromResult<ICloudBlob>(null); });
            cloudBlobContainerWrapperMock
                .Setup(m => m.DownloadBlobContentAsync(It.IsAny<string>(), CancellationToken.None))
                .Returns<string, CancellationToken>((blobName, token) =>
                {
                    if (repository.ContainsKey(blobName))
                    {
                        return Task.FromResult<string>(repository[blobName]);
                    }
                    else
                    {
                        StorageException ex = new StorageException(new RequestResult(), string.Empty, null);
                        ex.RequestInformation.HttpStatusCode = (int)HttpStatusCode.NotFound;
                        throw ex;
                    }
                });
            cloudBlobContainerWrapperMock
                .Setup(m => m.DeleteBlobIfExistsAsync(It.IsAny<string>(), CancellationToken.None))
                .Returns<string, CancellationToken>((blobName, token) => { repository.Remove(blobName); return Task.CompletedTask; });

            ICloudStorageProviderFactory cloudStorageProviderFactoryMock = Mock.Of<ICloudStorageProviderFactory>(m => m.GetSmartSignalStateStorageContainer() == cloudBlobContainerWrapperMock.Object);

            BlobStateRepository blobStateRepository = new BlobStateRepository("TestSignal", cloudStorageProviderFactoryMock, (new Mock<ITracer>()).Object);

            await TestBasicFlow(blobStateRepository);
        }

        [TestMethod]
        [Ignore]
        public async Task WhenExecutingBasigStateActionsThenFlowCompletesSuccesfullyWithRealStorage()
        {
            var storageConnectionString = "****";
            CloudBlobClient cloudBlobClient = CloudStorageAccount.Parse(storageConnectionString).CreateCloudBlobClient();
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference("tessignalstatecontainer");
            await cloudBlobContainer.CreateIfNotExistsAsync();
            CloudBlobContainerWrapper cloudBlobContainerWrapper = new CloudBlobContainerWrapper(cloudBlobContainer);

            ICloudStorageProviderFactory cloudStorageProviderFactoryMock = Mock.Of<ICloudStorageProviderFactory>(m => m.GetSmartSignalStateStorageContainer() == cloudBlobContainerWrapper);

            BlobStateRepository blobStateRepository = new BlobStateRepository("TestSignal", cloudStorageProviderFactoryMock, (new Mock<ITracer>()).Object);

            await TestBasicFlow(blobStateRepository);

            // delete all remaining blobs
            foreach (var blob in cloudBlobContainer.ListBlobs(useFlatBlobListing: true))
            {
                var blockblob = blob as CloudBlockBlob;
                await blockblob?.DeleteIfExistsAsync();
            }
        }

        private static async Task TestBasicFlow(IStateRepository blobStateRepository)
        {
            var originalState = new TestState
            {
                Field1 = "testdata",
                Field2 = new List<DateTime> { new DateTime(2018, 02, 15) },
                Field3 = true
            };

            // get non existing state, should return null
            var retrievedState = await blobStateRepository.GetStateAsync<TestState>("key", CancellationToken.None);
            Assert.IsNull(retrievedState);

            await blobStateRepository.StoreStateAsync("key", originalState, CancellationToken.None);

            retrievedState = await blobStateRepository.GetStateAsync<TestState>("key", CancellationToken.None);

            // validate
            Assert.AreEqual(originalState.Field1, retrievedState.Field1);
            CollectionAssert.AreEquivalent(originalState.Field2, retrievedState.Field2);
            Assert.AreEqual(originalState.Field3, retrievedState.Field3);
            Assert.AreEqual(originalState.Field4, retrievedState.Field4);

            // update existing state
            var updatedState = new TestState
            {
                Field1 = null,
                Field2 = new List<DateTime> { new DateTime(2018, 02, 15) },
                Field3 = true
            };

            await blobStateRepository.StoreStateAsync("key", updatedState, CancellationToken.None);

            retrievedState = await blobStateRepository.GetStateAsync<TestState>("key", CancellationToken.None);

            // validate
            Assert.AreEqual(updatedState.Field1, retrievedState.Field1);
            CollectionAssert.AreEquivalent(updatedState.Field2, retrievedState.Field2);
            Assert.AreEqual(updatedState.Field3, retrievedState.Field3);
            Assert.AreEqual(updatedState.Field4, retrievedState.Field4);

            await blobStateRepository.StoreStateAsync("key2", originalState, CancellationToken.None);
            await blobStateRepository.DeleteStateAsync("key", CancellationToken.None);

            // clear again, should not throw
            await blobStateRepository.DeleteStateAsync("key", CancellationToken.None);

            retrievedState = await blobStateRepository.GetStateAsync<TestState>("key", CancellationToken.None);

            Assert.IsNull(retrievedState);

            retrievedState = await blobStateRepository.GetStateAsync<TestState>("key2", CancellationToken.None);

            Assert.IsNotNull(retrievedState);
        }

        private class TestState
        {
            public string Field1 { get; set; }

            public List<DateTime> Field2 { get; set; }

            public bool Field3 { get; set; }

            public string Field4 { get; set; }
        }
    }
}
