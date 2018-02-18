//-----------------------------------------------------------------------
// <copyright file="InMemoryStateRepositoryTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalsSharedTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.State;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class InMemoryStateRepositoryTests
    {
        [TestMethod]
        public void WhenRunninMultipleStateActionsInParallelThenNoExceptionIsThrown()
        {
            var stateRepo = new InMemoryStateRepository("TetsSignal");

            Random random = new Random();
            List<Tuple<string, string>> list = Enumerable.Range(1, 10000)
                .Select(num => new Tuple<string, string>(random.Next(10).ToString(), random.Next(10).ToString()))
                .ToList();

            Parallel.ForEach(list, (tuple) => TestSigleRun(tuple.Item1, tuple.Item2).Wait());
        }

        [TestMethod]
        public async Task WhenExecutingBasigStateActionsThenFlowCompletesSuccesfully()
        {
            IStateRepository stateRepository = new InMemoryStateRepository("test signal");

            var originalState = new TestState
            {
                Field1 = "testdata",
                Field2 = new List<DateTime> { new DateTime(2018, 02, 15) },
                Field3 = true
            };

            await stateRepository.AddOrUpdateStateAsync("key", originalState, CancellationToken.None);

            var retrievedState = await stateRepository.GetStateAsync<TestState>("key", CancellationToken.None);

            // validate
            Assert.AreEqual(originalState.Field1, retrievedState.Field1);
            CollectionAssert.AreEquivalent(originalState.Field2, retrievedState.Field2);
            Assert.AreEqual(originalState.Field3, retrievedState.Field3);
            Assert.AreEqual(originalState.Field4, retrievedState.Field4);

            // update existing state
            var updatedState = new TestState
            {
                Field1 = null,
                Field2 = new List<DateTime> { new DateTime(2018, 02, 15) },
                Field3 = true
            };

            await stateRepository.AddOrUpdateStateAsync("key", updatedState, CancellationToken.None);

            retrievedState = await stateRepository.GetStateAsync<TestState>("key", CancellationToken.None);

            // validate
            Assert.AreEqual(updatedState.Field1, retrievedState.Field1);
            CollectionAssert.AreEquivalent(updatedState.Field2, retrievedState.Field2);
            Assert.AreEqual(updatedState.Field3, retrievedState.Field3);
            Assert.AreEqual(updatedState.Field4, retrievedState.Field4);

            await stateRepository.AddOrUpdateStateAsync("key2", originalState, CancellationToken.None);
            await stateRepository.ClearState("key", CancellationToken.None);

            retrievedState = await stateRepository.GetStateAsync<TestState>("key", CancellationToken.None);

            Assert.IsNull(retrievedState);

            retrievedState = await stateRepository.GetStateAsync<TestState>("key2", CancellationToken.None);

            Assert.IsNotNull(retrievedState);
        }

        private static async Task TestSigleRun(string signalId, string key)
        {
            var stateRepo = new InMemoryStateRepository(signalId);

            var state = new List<int> { 5, 10 };

            await stateRepo.AddOrUpdateStateAsync(key, state, CancellationToken.None);
            await stateRepo.GetStateAsync<List<int>>(key, CancellationToken.None);
            await stateRepo.AddOrUpdateStateAsync(key, state, CancellationToken.None);
            await stateRepo.GetStateAsync<List<int>>(key, CancellationToken.None);
            await stateRepo.ClearState(key, CancellationToken.None);
            await stateRepo.GetStateAsync<List<int>>(key, CancellationToken.None);
        }

        public class TestState
        {
            public string Field1 { get; set; }

            public List<DateTime> Field2 { get; set; }

            public bool Field3 { get; set; }

            public string Field4 { get; set; }
        }
    }
}
