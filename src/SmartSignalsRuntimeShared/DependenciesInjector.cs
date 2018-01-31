﻿//-----------------------------------------------------------------------
// <copyright file="DependenciesInjector.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared
{
    using Microsoft.Azure.Monitoring.SmartSignals.Clients;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.ChildProcess;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.Trace;
    using Microsoft.Azure.WebJobs.Host;
    using Unity;

    /// <summary>
    /// A static class that is used to inject dependencies
    /// </summary>
    public static class DependenciesInjector
    {
        /// <summary>
        /// Get a unity container with the appropriate registered dependencies
        /// </summary>
        /// <returns>The unity container</returns>
        public static IUnityContainer GetContainer()
        {
            // Register main dependencies
            IUnityContainer container = new UnityContainer();
            container
                .RegisterType<ICloudStorageProviderFactory, CloudStorageProviderFactory>()
                .RegisterType<IHttpClientWrapper, HttpClientWrapper>()
                .RegisterType<ICredentialsFactory, MsiCredentialsFactory>()
                .RegisterType<ISmartSignalRepository, SmartSignalRepository>()
                .RegisterType<IAzureResourceManagerClient, AzureResourceManagerClient>()
                .RegisterType<IChildProcessManager, ChildProcessManager>();

            return container;
        }

        /// <summary>
        /// Creates a new tracer instance and register it with the specified container
        /// </summary>
        /// <param name="container">The unity container</param>
        /// <param name="logger">The logger</param>
        /// <param name="traceToConsole">Whether to trace to console</param>
        /// <returns>The unity container, after registering the new tracer</returns>
        public static IUnityContainer WithTracer(this IUnityContainer container, TraceWriter logger, bool traceToConsole)
        {
            ITracer tracer = TracerFactory.Create(null, logger, traceToConsole);
            return container.RegisterInstance(tracer);
        }
    }
}