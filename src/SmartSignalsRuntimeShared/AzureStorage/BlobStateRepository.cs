//-----------------------------------------------------------------------
// <copyright file="BlobStateRepository.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.Extensions;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.Extensions;
    using Microsoft.Azure.Monitoring.SmartSignals.State;
    using Microsoft.Azure.Monitoring.SmartSignals.Tools;
    using Microsoft.WindowsAzure.Storage;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a persistent repository for storing signal related data (state) between analysis runs build on top of blob storage.
    /// </summary>
    public class BlobStateRepository : IStateRepository
    {
        private readonly ICloudBlobContainerWrapper cloudBlobContainerWrapper;
        private readonly string signalId;
        private readonly ITracer tracer;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlobStateRepository"/> class
        /// </summary>
        /// <param name="cloudStorageProviderFactory">The cloud storage provider factory</param>
        /// <param name="signalId">The id of the signal</param>
        /// <param name="tracer">The tracer</param>
        public BlobStateRepository(ICloudStorageProviderFactory cloudStorageProviderFactory, string signalId, ITracer tracer)
        {
            Diagnostics.EnsureArgumentNotNull(() => signalId);

            this.cloudBlobContainerWrapper = cloudStorageProviderFactory.GetSmartSignalStateStorageContainer();
            this.signalId = signalId;
            this.tracer = tracer;
        }

        /// <summary>
        /// Creates or updates the state by key
        /// </summary>
        /// <typeparam name="T">Type type of the state</typeparam>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="state">The state</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{T}"/> to wait on</returns>
        public Task AddOrUpdateStateAsync<T>(string key, T state, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            if (state == null)
            {
                throw new ArgumentNullException(nameof(state));
            }

            key = key.ToLowerInvariant();

            string serializedState = JsonConvert.SerializeObject(state);

            BlobState blobState = new BlobState
            {
                Key = key,
                SignalId = this.signalId,
                SerializedState = serializedState
            };

            string serializedBlobState = JsonConvert.SerializeObject(blobState);

            return this.cloudBlobContainerWrapper.UploadBlobAsync(this.GenerateBlobName(key), serializedBlobState, cancellationToken);
        }

        /// <summary>
        /// Gets signal state by key
        /// </summary>
        /// <typeparam name="T">Type type of the state</typeparam>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A state associated with the signal and the key wrapped in a <see cref="Task{T}"/></returns>
        public async Task<T> GetStateAsync<T>(string key, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            key = key.ToLowerInvariant();

            string serializedBlobState = null;
            try
            {
                serializedBlobState = await this.cloudBlobContainerWrapper.DownloadBlobContentAsync(this.GenerateBlobName(key), cancellationToken);
            }
            catch (StorageException ex) when ((HttpStatusCode)ex.RequestInformation.HttpStatusCode == HttpStatusCode.NotFound)
            {
                this.tracer.TraceWarning("State not found in the repository, returning empty state");
                return default(T);
            }

            BlobState blobState = JsonConvert.DeserializeObject<BlobState>(serializedBlobState);

            if (string.Equals(blobState.SignalId, this.signalId) == false 
                || string.Equals(blobState.Key, key) == false
                || string.IsNullOrWhiteSpace(blobState.SerializedState))
            {
                this.tracer.TraceWarning("State does not match expected signal id, key or is empty, returning empty state");
                return default(T);
            }

            return JsonConvert.DeserializeObject<T>(blobState.SerializedState);
        }

        /// <summary>
        /// Clear the state by key
        /// </summary>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{T}"/> to wait on</returns>
        public Task ClearState(string key, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            key = key.ToLowerInvariant();

            return this.cloudBlobContainerWrapper.DeleteBlobIfExistsAsync(this.GenerateBlobName(key), cancellationToken);
        }

        /// <summary>
        /// Generates the name of the blob for storing the state.
        /// The name of the blob consists of alphanumeric characters of the signal id and hashes of the signal id and key.
        /// This logic insures that restrictions on blob names in storage do not cause restrictions on signal name or the key.
        /// The partial, un-hashed signal name is included for debugging purposes.  
        /// </summary>
        /// <param name="key">The key (case insensitive)</param>
        /// <returns>The name of the blob</returns>
        private string GenerateBlobName(string key)
        {
            string signalIdHash = this.signalId.Hash();
            string safeSignalId = new string(this.signalId.Where(char.IsLetterOrDigit).ToArray());

            string keyHash = key.Hash();

            string blobName = $"{safeSignalId}_{signalIdHash}/{keyHash}";

            return blobName;
        }
    }
}
