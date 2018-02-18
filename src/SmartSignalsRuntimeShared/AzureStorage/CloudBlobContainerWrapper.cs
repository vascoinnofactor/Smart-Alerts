﻿//-----------------------------------------------------------------------
// <copyright file="CloudBlobContainerWrapper.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.WindowsAzure.Storage.Blob;

    /// <summary>
    /// A wrapper of the Azure cloud blob container
    /// </summary>
    public class CloudBlobContainerWrapper : ICloudBlobContainerWrapper
    {
        private readonly CloudBlobContainer cloudBlobContainer;

        /// <summary>
        /// Initializes a new instance of the <see cref="CloudBlobContainerWrapper"/> class.
        /// </summary>
        /// <param name="cloudBlobContainer">Cloud blob container</param>
        public CloudBlobContainerWrapper(CloudBlobContainer cloudBlobContainer)
        {
            this.cloudBlobContainer = cloudBlobContainer;
        }

        /// <summary>
        /// Returns a list of the blobs in the container.
        /// </summary>
        /// <param name="prefix">A string containing the blob name prefix.</param>
        /// <param name="useFlatBlobListing">A boolean value that specifies whether to list blobs in a flat listing, or whether to list blobs hierarchically, by virtual directory.</param>
        /// <param name="blobListingDetails">A BlobListingDetails enumeration describing which items to include in the listing.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>A list of objects that implement <see cref="IListBlobItem"/></returns>
        public async Task<IList<IListBlobItem>> ListBlobsAsync(string prefix, bool useFlatBlobListing, BlobListingDetails blobListingDetails, CancellationToken cancellationToken)
        {
            var blobs = new List<IListBlobItem>();
            BlobContinuationToken token = null;
            do
            {
                var resultSegment = await this.cloudBlobContainer.ListBlobsSegmentedAsync(prefix, useFlatBlobListing, blobListingDetails, null, token, null, null, cancellationToken);
                token = resultSegment.ContinuationToken;
                blobs.AddRange(resultSegment.Results);
            }
            while (token != null);

            return blobs;
        }

        /// <summary>
        /// Uploads a string of text to a blob. If the blob already exists, it will be overwritten.
        /// </summary>
        /// <param name="blobName">The blob name.</param>
        /// <param name="blobContent">The content to upload.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>A <see cref="ICloudBlob"/> reference to the blob in the container</returns>
        public async Task<ICloudBlob> UploadBlobAsync(string blobName, string blobContent, CancellationToken cancellationToken)
        {
            CloudBlockBlob blob = this.cloudBlobContainer.GetBlockBlobReference(blobName);
            await blob.UploadTextAsync(blobContent, cancellationToken);
            return blob;
        }

        /// <summary>
        /// Downloads the content of a given blob name.
        /// </summary>
        /// <param name="blobName">The blob name.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>The blob's content.</returns>
        public async Task<string> DownloadBlobContentAsync(string blobName, CancellationToken cancellationToken)
        {
            CloudBlockBlob blob = this.cloudBlobContainer.GetBlockBlobReference(blobName);

            return await blob.DownloadTextAsync(cancellationToken);
        }

        /// <summary>
        /// Deletes blob by name and does not throw if the blob does not exist
        /// </summary>
        /// <param name="blobName">The blob name.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>The blob's content.</returns>
        public Task DeleteBlobIfExistsAsync(string blobName, CancellationToken cancellationToken)
        {
            CloudBlockBlob blob = this.cloudBlobContainer.GetBlockBlobReference(blobName);

            return blob.DeleteIfExistsAsync(cancellationToken);
        }
    }
}
