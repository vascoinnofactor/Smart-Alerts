//-----------------------------------------------------------------------
// <copyright file="IStateRepositoryFactory.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    /// <summary>
    /// Represents a factory for creating state repository for a signal.
    /// </summary>
    public interface IStateRepositoryFactory
    {
        /// <summary>
        /// Creates a state repository for a signal with ID <paramref name="signalId"/>.
        /// </summary>
        /// <param name="signalId">The ID of the signal to create the state repository for.</param>
        /// <returns>A state repository associated with the requested signal.</returns>
        IStateRepository Create(string signalId);
    }
}
