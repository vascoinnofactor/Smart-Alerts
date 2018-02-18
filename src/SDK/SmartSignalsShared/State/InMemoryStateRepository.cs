//-----------------------------------------------------------------------
// <copyright file="InMemoryStateRepository.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    using System;
    using System.Collections.Concurrent;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.Tools;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a non-persistent, in-memory state repository.
    /// </summary>
    public class InMemoryStateRepository : IStateRepository
    {
        private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, string>> StateDictionary = new ConcurrentDictionary<string, ConcurrentDictionary<string, string>>();
        private readonly string signalId;

        /// <summary>
        /// Initializes a new instance of the <see cref="InMemoryStateRepository"/> class
        /// </summary>
        /// <param name="signalId">The id of the signal</param>
        public InMemoryStateRepository(string signalId)
        {
            Diagnostics.EnsureArgumentNotNull(() => signalId);

            this.signalId = signalId;

            if (StateDictionary.ContainsKey(signalId) == false)
            {
                StateDictionary.TryAdd(signalId, new ConcurrentDictionary<string, string>(StringComparer.InvariantCultureIgnoreCase));
            }
        }

        /// <summary>
        /// Creates or updates the state by key
        /// </summary>
        /// <typeparam name="T">Type type of the state</typeparam>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="state">The state</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{T}"/> to wait on</returns>
        public Task AddOrUpdateStateAsync<T>(string key, T state, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            if (state == null)
            {
                throw new ArgumentNullException(nameof(state));
            }

            StateDictionary[this.signalId][key] = JsonConvert.SerializeObject(state);

            return Task.CompletedTask;
        }

        /// <summary>
        /// Clear the state by key
        /// </summary>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{T}"/> to wait on</returns>
        public Task ClearState(string key, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            StateDictionary[this.signalId].TryRemove(key, out _);

            return Task.CompletedTask;
        }

        /// <summary>
        /// Gets signal state by key
        /// </summary>
        /// <typeparam name="T">Type type of the state</typeparam>
        /// <param name="key">The key (case insensitive)</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A state associated with the signal and the key wrapped in a <see cref="Task{T}"/></returns>
        public Task<T> GetStateAsync<T>(string key, CancellationToken cancellationToken)
        {
            Diagnostics.EnsureArgumentNotNull(() => key);

            if (StateDictionary[this.signalId].TryGetValue(key, out string value))
            {
                T state = JsonConvert.DeserializeObject<T>(value);
                return Task.FromResult(state);
            }

            return Task.FromResult(default(T));
        }
    }
}
