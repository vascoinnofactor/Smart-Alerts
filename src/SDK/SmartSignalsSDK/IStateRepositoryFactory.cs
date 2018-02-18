//-----------------------------------------------------------------------
// <copyright file="IStateRepositoryFactory.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals
{
    /// <summary>
    /// Represents a factory for creating state repository for a signal.
    /// </summary>
    public interface IStateRepositoryFactory
    {
        /// <summary>
        /// Creates a state repository for a signal by signal id.
        /// </summary>
        /// <param name="signalId">The id of a signal</param>
        /// <returns>A state repository associated with the signal</returns>
        IStateRepository Create(string signalId);
    }
}
