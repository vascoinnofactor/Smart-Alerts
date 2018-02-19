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
        /// Gets a signal's state that was saved with <paramref name="key"/>.
        /// If state does not exist, returns default(T).
        /// </summary>
        /// <typeparam name="T">The type of the state. The repository will try to JSON-deserialize the stored state to this type.</typeparam>
        /// <param name="key">The key that was used to store the state (case insensitive).</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task"/> object that represents the asynchronous operation, returning the requested state.</returns>
        Task<T> GetStateAsync<T>(string key, CancellationToken cancellationToken);

        /// <summary>
        /// Store <paramref name="state"/> in the repository with the specified <paramref name="key"/>. 
        /// If there is already a state stored with the same key, it will be replaced by <paramref name="state"/>.
        /// </summary>
        /// <typeparam name="T">The type of the state. The repository will store the state in the repository as a JSON-serialized string.</typeparam>
        /// <param name="key">The state's key (case insensitive).</param>
        /// <param name="state">The state to store.</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task"/> object that represents the asynchronous operation.</returns>
        Task StoreStateAsync<T>(string key, T state, CancellationToken cancellationToken);

        /// <summary>
        /// Deletes the state specified by <paramref name="key"/> from the repository.
        /// </summary>
        /// <param name="key">The key of the state to delete (case insensitive).</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task"/> object that represents the asynchronous operation.</returns>
        Task DeleteStateAsync(string key, CancellationToken cancellationToken);
    }
}
