﻿//-----------------------------------------------------------------------
// <copyright file="SmartSignalRunnerMain.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalRunnerChildProcess
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.Analysis;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared;
    using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.ChildProcess;
    using Microsoft.Azure.Monitoring.SmartSignals.SignalResultPresentation;
    using Unity;

    /// <summary>
    /// The main class of the process that runs the smart signal
    /// </summary>
    public static class SmartSignalRunnerMain
    {
        private static IUnityContainer container;
        
        /// <summary>
        /// The main method
        /// </summary>
        /// <param name="args">Command line arguments. These arguments are expected to be created by <see cref="IChildProcessManager.RunChildProcessAsync{TOutput}"/>.</param>
        /// <returns>Exit code</returns>
        public static int Main(string[] args)
        {
            ITracer tracer = null;
            try
            {
                // Inject dependencies
                container = DependenciesInjector.GetContainer()
                    .InjectAnalysisDependencies(withChildProcessRunner: false)
                    .WithChildProcessTracer(args);

                // Trace
                tracer = container.Resolve<ITracer>();
                tracer.TraceInformation($"Starting signal runner process, process ID {Process.GetCurrentProcess().Id}");

                // Run the analysis
                IChildProcessManager childProcessManager = container.Resolve<IChildProcessManager>();
                childProcessManager.RunAndListenToParentAsync<SmartSignalRequest, List<SmartSignalResultItemPresentation>>(args, RunSignalAsync).Wait();

                return 0;
            }
            catch (Exception e)
            {
                tracer?.TraceError("Unhandled exception in child process: " + e.Message);
                Console.Error.WriteLine(e.ToString());
                return -1;
            }
        }

        /// <summary>
        /// Run the signal, by delegating the call to the registered <see cref="ISmartSignalRunner"/>
        /// </summary>
        /// <param name="request">The signal request</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{TResult}"/>, returning the result items presentations generated by the signal</returns>
        private static async Task<List<SmartSignalResultItemPresentation>> RunSignalAsync(SmartSignalRequest request, CancellationToken cancellationToken)
        {
            ISmartSignalRunner smartSignalRunner = container.Resolve<ISmartSignalRunner>();
            return await smartSignalRunner.RunAsync(request, cancellationToken);
        }
    }
}
