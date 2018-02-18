//-----------------------------------------------------------------------
// <copyright file="IStateRepository.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals
{
    using System.Threading;
    using System.Threading.Tasks;

    /// <summary>
    /// Represents a persistent repository for storing signal related data (state) between analysis runs.
    /// </summary>
    public interface IStateRepository
    {
        /// <summary>
        /// Gets signal state by key
        /// </summary>
        /// <typeparam name="T">Type type of the state</typeparam>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A state associated with the signal and the key wrapped in a <see cref="Task{T}"/></returns>
        Task<T> GetStateAsync<T>(string key, CancellationToken cancellationToken);

        /// <summary>
        /// Creates or updates the state by key
        /// </summary>
        /// <typeparam name="T">Type type of the state</typeparam>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="state">The state</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{T}"/> to wait on</returns>
        Task AddOrUpdateStateAsync<T>(string key, T state, CancellationToken cancellationToken);

        /// <summary>
        /// Clear the state by key
        /// </summary>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{T}"/> to wait on</returns>
        Task ClearState(string key, CancellationToken cancellationToken);
    }
}
