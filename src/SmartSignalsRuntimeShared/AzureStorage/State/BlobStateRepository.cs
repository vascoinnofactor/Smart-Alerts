//-----------------------------------------------------------------------
// <copyright file="BlobStateRepository.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals
{
    using System;
    using System.IO;
    using System.IO.Compression;
    using System.Linq;
    using System.Net;
    using System.Text;
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
        private const int MaxSerializedStateLength = 1024 * 1024 * 1024;

        private readonly ICloudBlobContainerWrapper cloudBlobContainerWrapper;
        private readonly string signalId;
        private readonly ITracer tracer;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlobStateRepository"/> class
        /// </summary>
        /// <param name="signalId">The id of the signal</param>
        /// <param name="cloudStorageProviderFactory">The cloud storage provider factory</param>
        /// <param name="tracer">The tracer</param>
        public BlobStateRepository(string signalId, ICloudStorageProviderFactory cloudStorageProviderFactory, ITracer tracer)
        {
            Diagnostics.EnsureArgumentNotNull(() => signalId);

            this.signalId = signalId;
            this.cloudBlobContainerWrapper = cloudStorageProviderFactory.GetSmartSignalStateStorageContainer();
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
        public Task StoreStateAsync<T>(string key, T state, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            if (state == null)
            {
                throw new ArgumentNullException(nameof(state));
            }

            key = key.ToLowerInvariant();

            string serializedState = JsonConvert.SerializeObject(state);
            if (serializedState.Length > MaxSerializedStateLength)
            {
                throw new StateTooBigException(serializedState.Length, MaxSerializedStateLength);
            }

            string compressedSerializedState = CompressString(serializedState);

            BlobState blobState = new BlobState
            {
                Key = key,
                SignalId = this.signalId,
                State = compressedSerializedState
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
                this.tracer.TraceInformation("State not found in the repository, returning empty state");
                return default(T);
            }

            BlobState blobState = JsonConvert.DeserializeObject<BlobState>(serializedBlobState);

            if (string.Equals(blobState.SignalId, this.signalId) == false || string.Equals(blobState.Key, key) == false)
            {
                throw new InvalidDataException("State does not match expected signal id or key");
            }

            if (string.IsNullOrWhiteSpace(blobState.State))
            {
                return default(T);
            }

            string compressedSerializedState = blobState.State;

            string serializedState = DecompressString(compressedSerializedState);

            return JsonConvert.DeserializeObject<T>(serializedState);
        }

        /// <summary>
        /// Clear the state by key
        /// </summary>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{T}"/> to wait on</returns>
        public Task DeleteStateAsync(string key, CancellationToken cancellationToken)
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
        /// <param name="stringToCompress">The key (case insensitive)</param>
        /// <returns>The name of the blob</returns>
        private static string CompressString(string stringToCompress)
        {
            byte[] bytesToCompress = Encoding.UTF8.GetBytes(stringToCompress);

            using (var inputStream = new MemoryStream(bytesToCompress))
            {
                using (var outputStream = new MemoryStream())
                {
                    using (var gzipStream = new GZipStream(outputStream, CompressionMode.Compress))
                    {
                        inputStream.CopyTo(gzipStream);
                    }

                    return Convert.ToBase64String(outputStream.ToArray());
                }
            }
        }

        /// <summary>
        /// Generates the name of the blob for storing the state.
        /// The name of the blob consists of alphanumeric characters of the signal id and hashes of the signal id and key.
        /// This logic insures that restrictions on blob names in storage do not cause restrictions on signal name or the key.
        /// The partial, un-hashed signal name is included for debugging purposes.  
        /// </summary>
        /// <param name="stringToDecompress">The key (case insensitive)</param>
        /// <returns>The name of the blob</returns>
        private static string DecompressString(string stringToDecompress)
        {
            using (var inputStream = new MemoryStream(Convert.FromBase64String(stringToDecompress)))
            {
                using (var outputStream = new MemoryStream())
                {
                    using (var gzipStream = new GZipStream(inputStream, CompressionMode.Decompress))
                    {
                        gzipStream.CopyTo(outputStream);
                        return Encoding.UTF8.GetString(outputStream.ToArray());
                    }
                }
            }
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

        /// <summary>
        /// Represents a signal state written to a blob
        /// </summary>
        private class BlobState
        {
            /// <summary>
            /// Gets or sets the signal id
            /// </summary>
            public string SignalId { get; set; }

            /// <summary>
            /// Gets or sets the signal key
            /// </summary>
            public string Key { get; set; }

            /// <summary>
            /// Gets or sets the signal serialized state
            /// </summary>
            public string State { get; set; }
        }
    }
}
