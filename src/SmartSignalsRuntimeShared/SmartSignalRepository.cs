﻿//-----------------------------------------------------------------------
// <copyright file="SmartSignalRepository.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.RuntimeShared
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.RuntimeShared.AzureStorage;
    using Microsoft.Azure.Monitoring.SmartAlerts.Appliance.RuntimeShared.Exceptions;
    using Microsoft.Azure.Monitoring.SmartAlerts.Package;
    using Microsoft.Azure.Monitoring.SmartAlerts.Tools;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Implementation of the <see cref="ISmartSignalRepository"/> interface over Azure Blob Storage.
    /// The repository assumes a Smart Signal container structure of a directory for each signal and in that directory there is a package for each version of this signal.
    /// </summary>
    public class SmartSignalRepository : ISmartSignalRepository
    {
        private readonly ITracer tracer;
        private readonly ICloudBlobContainerWrapper containerClient;

        /// <summary>
        /// Initializes a new instance of the<see cref="SmartSignalRepository"/> class.
        /// </summary>
        /// <param name="tracer">Log wrapper</param>
        /// <param name="storageProviderFactory">The Azure storage provider factory</param>
        public SmartSignalRepository(ITracer tracer, ICloudStorageProviderFactory storageProviderFactory)
        {
            this.tracer = Diagnostics.EnsureArgumentNotNull(() => tracer);
            this.containerClient = storageProviderFactory.GetSmartSignalGlobalStorageContainer();
        }

        /// <summary>
        /// Reads all the smart signals manifests from the repository.
        /// For each signal we return the latest version's manifest.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>A <see cref="Task{TResult}"/> returning the smart signals manifests</returns>
        public async Task<IList<SmartSignalManifest>> ReadAllSignalsManifestsAsync(CancellationToken cancellationToken)
        {
            // We don't want to open the signal packages to get the manifest so we read it from the blob's metadata
            this.tracer.TraceInformation("Getting all smart signals manifests from the blob metadata");
            try
            {
                var allSignalsManifests = new List<SmartSignalManifest>();
                IEnumerable<CloudBlob> blobs = (await this.containerClient.ListBlobsAsync(string.Empty, true, BlobListingDetails.Metadata, cancellationToken)).Cast<CloudBlob>().Where(blob => blob.Metadata.ContainsKey("id"));

                ILookup<string, CloudBlob> signalIdToAllVersionsLookup = blobs.ToLookup(blob => blob.Metadata["id"], blob => blob);
                foreach (IGrouping<string, CloudBlob> signalVersionsGroup in signalIdToAllVersionsLookup)
                {
                    string signalId = signalVersionsGroup.Key;
                    if (string.IsNullOrWhiteSpace(signalId))
                    {
                        // blob is not a signal
                        continue;
                    }

                    // Get the latest version blob of the signal
                    CloudBlob latestVersionSignalBlob = this.GetLatestVersionSignalBlob(signalIdToAllVersionsLookup[signalId]);

                    if (latestVersionSignalBlob != null)
                    {
                        // Generate the manifest from the blob's metadata
                        allSignalsManifests.Add(this.GenerateSmartSignalManifest(latestVersionSignalBlob.Metadata));
                    }
                }

                return allSignalsManifests;
            }
            catch (StorageException e)
            {
                throw new SmartSignalRepositoryException("Failed to get all signals manifests from storage", e);
            }
        }

        /// <summary>
        /// Reads a smart signal's package from the repository
        /// </summary>
        /// <param name="signalId">The signal's ID</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>A <see cref="Task{TResult}"/> returning the signal package</returns>
        public async Task<SmartSignalPackage> ReadSignalPackageAsync(string signalId, CancellationToken cancellationToken)
        {
            this.tracer.TraceInformation($"Getting smart signal {signalId} package");
            try
            {
                CloudBlob latestVersionSignalBlob = await this.GetLatestSignalBlobVersionAsync(signalId, cancellationToken);
                this.tracer.TraceInformation($"Last version signal BLOB is {latestVersionSignalBlob.Name}");

                using (var blobMemoryStream = new MemoryStream())
                {
                    // Download the blob to a stream and generate the signal package from it
                    await latestVersionSignalBlob.DownloadToStreamAsync(blobMemoryStream, cancellationToken);
                    return SmartSignalPackage.CreateFromStream(blobMemoryStream, this.tracer);
                }
            }
            catch (StorageException e)
            {
                throw new SmartSignalRepositoryException("Failed to get signal package from storage", e);
            }
        }

        /// <summary>
        /// Gets the latest signal blob version
        /// </summary>
        /// <param name="signalId">The signal ID</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>A <see cref="CloudBlob"/> representing the signal package blob</returns>
        private async Task<CloudBlob> GetLatestSignalBlobVersionAsync(string signalId, CancellationToken cancellationToken)
        {
            List<CloudBlob> blobs = (await this.containerClient.ListBlobsAsync($"{signalId}/", true, BlobListingDetails.Metadata, cancellationToken)).Cast<CloudBlob>().ToList();
            if (!blobs.Any())
            {
                throw new SmartSignalRepositoryException($"No Signal package exists for signal {signalId}");
            }

            CloudBlob latestVersionSignalBlob = this.GetLatestVersionSignalBlob(blobs);
            if (latestVersionSignalBlob == null)
            {
                throw new SmartSignalRepositoryException($"No Signal package with a valid version exists for signal {signalId}");
            }

            return latestVersionSignalBlob;
        }

        /// <summary>
        /// Gets the latest version blob from the blob list.
        /// </summary>
        /// <param name="blobs">A collection of blobs</param>
        /// <returns>the latest version signal blob</returns>
        private CloudBlob GetLatestVersionSignalBlob(IEnumerable<CloudBlob> blobs)
        {
            var latestVersionBlob =
                blobs.Where(blob => blob.Metadata.ContainsKey("version"))
                    .Aggregate((blob1, blob2) =>
                    {
                        Version.TryParse(blob1.Metadata["version"], out Version signalVersion1);
                        Version.TryParse(blob2.Metadata["version"], out Version signalVersion2);
                        if (signalVersion1 == null)
                        {
                            return blob2;
                        }

                        if (signalVersion2 == null)
                        {
                            return blob1;
                        }

                        return signalVersion1 > signalVersion2 ? blob1 : blob2;
                    });

            if (Version.TryParse(latestVersionBlob.Metadata["version"], out var _))
            {
                return latestVersionBlob;
            }

            // no valid version blob was found
            return null;
        }

        /// <summary>
        /// Generates a <see cref="SmartSignalManifest"/> from the blob's metadata
        /// </summary>
        /// <param name="signalMetadata">The blob's metadata</param>
        /// <returns>A <see cref="SmartSignalManifest"/> representing the signal's manifest</returns>
        private SmartSignalManifest GenerateSmartSignalManifest(IDictionary<string, string> signalMetadata)
        {
            var supportedResourceTypes = JArray.Parse(signalMetadata["supportedResourceTypes"])
                .Select(jtoken => (ResourceType)Enum.Parse(typeof(ResourceType), jtoken.ToString(), true))
                .ToList();

            var supportedCadencesInMinutes = JArray.Parse(signalMetadata["supportedCadencesInMinutes"])
                .Select(jToken => int.Parse(jToken.ToString()))
                .ToList();

             return new SmartSignalManifest(
                 signalMetadata["id"],
                 signalMetadata["name"],
                 signalMetadata["description"],
                 Version.Parse(signalMetadata["version"]), 
                 signalMetadata["assemblyName"],
                 signalMetadata["className"],
                 supportedResourceTypes,
                 supportedCadencesInMinutes);
        }
    }
}