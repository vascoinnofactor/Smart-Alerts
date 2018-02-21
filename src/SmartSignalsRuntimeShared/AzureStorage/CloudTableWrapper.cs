﻿//-----------------------------------------------------------------------
// <copyright file="CloudTableWrapper.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Appliance.RuntimeShared.AzureStorage
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// A wrapper of the azure cloud table
    /// </summary>
    public class CloudTableWrapper : ICloudTableWrapper
    {
        private readonly CloudTable cloudTable;

        /// <summary>
        /// Initializes a new instance of the <see cref="CloudTableWrapper"/> class.
        /// </summary>
        /// <param name="cloudTable">Cloud table</param>
        public CloudTableWrapper(CloudTable cloudTable)
        {
            this.cloudTable = cloudTable;
        }
        
        /// <summary>
        /// Creates the table if it does not already exist.
        /// </summary>
        /// <returns>true if table was created; otherwise, false.</returns>
        public bool CreateIfNotExists()
        {
            return this.cloudTable.CreateIfNotExists();
        }

        /// <summary>
        /// Initiates an asynchronous operation that executes an asynchronous table operation.
        /// </summary>
        /// <param name="operation">A <see cref="TableOperation"/> object that represents the operation to perform.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>A <see cref="System.Threading.Tasks.Task"/> object of type <see cref="TableResult"/> that represents the asynchronous operation.</returns>
        public Task<TableResult> ExecuteAsync(TableOperation operation, CancellationToken cancellationToken)
        {
            return this.cloudTable.ExecuteAsync(operation, cancellationToken);
        }

        /// <summary>
        /// Retrieves all entities with the given partition key
        /// </summary>
        /// <typeparam name="T">The type of the entity to return.</typeparam>
        /// <param name="partitionKey">A string containing the partition key</param>
        /// <returns>A <see cref="IList{T}"/> containing all entities of the given partition key</returns>
        public async Task<IList<T>> ReadPartitionAsync<T>(string partitionKey) where T : ITableEntity, new()
        {
            var results = new List<T>();
            var allFromPartitionQuery = new TableQuery<T>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey));
            TableContinuationToken token = null;
            do
            {
                TableQuerySegment<T> resultSegment = await this.cloudTable.ExecuteQuerySegmentedAsync(allFromPartitionQuery, token);
                token = resultSegment.ContinuationToken;
                results.AddRange(resultSegment.Results);
            }
            while (token != null);

            return results;
        }
    }
}
