//-----------------------------------------------------------------------
// <copyright file="BlobStateRepositoryFactory.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage
{
    using Microsoft.Azure.Monitoring.SmartSignals.Tools;

    /// <summary>
    /// Represents a factory for creating blob state repository for a signal.
    /// </summary>
    public class BlobStateRepositoryFactory : IStateRepositoryFactory
    {
        private readonly ICloudStorageProviderFactory cloudStorageProviderFactory;
        private readonly ITracer tracer;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlobStateRepositoryFactory"/> class
        /// </summary>
        /// <param name="cloudStorageProviderFactory">The cloud storage provider factory</param>
        /// <param name="tracer">The tracer</param>
        public BlobStateRepositoryFactory(ICloudStorageProviderFactory cloudStorageProviderFactory, ITracer tracer)
        {
            this.cloudStorageProviderFactory = Diagnostics.EnsureArgumentNotNull(() => cloudStorageProviderFactory);
            this.tracer = tracer;
        }

        /// <summary>
        /// Creates a state repository for a signal by signal id.
        /// </summary>
        /// <param name="signalId">The id of a signal</param>
        /// <returns>A state repository associated with the signal</returns>
        public IStateRepository Create(string signalId)
        {
            return new BlobStateRepository(this.cloudStorageProviderFactory, signalId, this.tracer);
        }
    }
}
