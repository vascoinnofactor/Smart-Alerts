//-----------------------------------------------------------------------
// <copyright file="InMemoryStateRepositoryFactory.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    using Microsoft.Azure.Monitoring.SmartSignals.Tools;

    /// <summary>
    /// Represents a factory for creating in-memory state repository for a signal.
    /// </summary>
    public class InMemoryStateRepositoryFactory : IStateRepositoryFactory
    {
        /// <summary>
        /// Creates a state repository for a signal with ID <paramref name="signalId"/>.
        /// </summary>
        /// <param name="signalId">The ID of the signal to create the state repository for.</param>
        /// <returns>A state repository associated with the requested signal.</returns>
        public IStateRepository Create(string signalId)
        {
            Diagnostics.EnsureStringNotNullOrWhiteSpace(() => signalId);

            return new InMemoryStateRepository(signalId);
        }
    }
}
