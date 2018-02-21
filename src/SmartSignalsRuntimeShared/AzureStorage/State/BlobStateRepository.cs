//-----------------------------------------------------------------------
// <copyright file="BlobStateRepository.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage.State
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
    using Microsoft.Azure.Monitoring.SmartSignals.State;
    using Microsoft.Azure.Monitoring.SmartSignals.Tools;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
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
        /// Store <paramref name="state"/> in the repository with the specified <paramref name="key"/>. 
        /// If there is already a state stored with the same key, it will be replaced by <paramref name="state"/>.
        /// </summary>
        /// <typeparam name="T">The type of the state. The repository will store the state in the repository as a JSON-serialized string.</typeparam>
        /// <param name="key">The state's key (case insensitive).</param>
        /// <param name="state">The state to store.</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task"/> object that represents the asynchronous operation.</returns>
        /// <exception cref="System.ArgumentNullException">This exception is thrown if the key or the state are null.</exception>
        /// <exception cref="StateSerializationException">This exception is thrown if state serialization fails.</exception>
        /// <exception cref="StateTooBigException">This exception is thrown if serialized state exceeds allowed length.</exception>
        /// <exception cref="StateStorageException">This exception is thrown if state was not stored due to storage issues.</exception>
        public Task StoreStateAsync<T>(string key, T state, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);
            if (state == null)
            {
                throw new ArgumentNullException(nameof(state));
            }

            key = key.ToLowerInvariant();

            string serializedState = string.Empty;
            try
            {
                serializedState = JsonConvert.SerializeObject(state);
            }
            catch (Exception ex)
            {
                throw new StateSerializationException(ex);
            }

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

            Task<ICloudBlob> uploadBlobTask = null;
            try
            {
                uploadBlobTask = this.cloudBlobContainerWrapper.UploadBlobAsync(this.GenerateBlobName(key), serializedBlobState, cancellationToken);
            }
            catch (Exception ex)
            {
                throw new StateStorageException(ex);
            }

            return uploadBlobTask;
        }

        /// <summary>
        /// Gets signal's state that was saved with <paramref name="key"/>.
        /// If state does not exist, returns default(<typeparamref name="T"/>).
        /// </summary>
        /// <typeparam name="T">The type of the state. The repository will try to JSON-deserialize the stored state to this type.</typeparam>
        /// <param name="key">The key that was used to store the state (case insensitive).</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task"/> object that represents the asynchronous operation, returning the requested state.</returns>
        /// <exception cref="System.ArgumentNullException">This exception is thrown if the key is null.</exception>
        /// <exception cref="StateSerializationException">This exception is thrown if state deserialization fails.</exception>
        /// <exception cref="StateStorageException">This exception is thrown if state was not retrieved due to storage issues.</exception>
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
            catch (Exception ex)
            {
                throw new StateStorageException(ex);
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

            T state = default(T);
            try
            {
                state = JsonConvert.DeserializeObject<T>(serializedState);
            }
            catch (Exception ex)
            {
                throw new StateSerializationException(ex);
            }

            return state;
        }

        /// <summary>
        /// Deletes the state specified by <paramref name="key"/> from the repository.
        /// </summary>
        /// <param name="key">The key of the state to delete (case insensitive).</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task"/> object that represents the asynchronous operation.</returns>
        /// <exception cref="System.ArgumentNullException">This exception is thrown if the key is null.</exception>
        /// <exception cref="StateStorageException">This exception is thrown if state was not deleted due to storage issues.</exception>
        public Task DeleteStateAsync(string key, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            key = key.ToLowerInvariant();

            Task deleteBlobTask = null;
            try
            {
                deleteBlobTask = this.cloudBlobContainerWrapper.DeleteBlobIfExistsAsync(this.GenerateBlobName(key), cancellationToken);
            }
            catch (Exception ex)
            {
                throw new StateStorageException(ex);
            }

            return deleteBlobTask;
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
