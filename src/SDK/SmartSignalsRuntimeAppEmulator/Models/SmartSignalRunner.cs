//-----------------------------------------------------------------------
// <copyright file="SmartSignalRunner.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.Models
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals.State;

    /// <summary>
    /// An observable class that runs a smart signal.
    /// </summary>
    public class SmartSignalRunner : ObservableObject
    {
        private readonly ISmartSignal smartSignal;

        private readonly IAnalysisServicesFactory analysisServicesFactory;

        private SmartSignalResult result;

        private ITracer tracer;

        private bool isSignalRunning;

        private CancellationTokenSource cancellationTokenSource;

        private IStateRepositoryFactory stateRepositoryFactory;

        private string signalId;

        /// <summary>
        /// Initializes a new instance of the <see cref="SmartSignalRunner"/> class.
        /// </summary>
        /// <param name="smartSignal">The smart signal.</param>
        /// <param name="analysisServicesFactory">The analysis services factory.</param>
        /// <param name="stateRepositoryFactory">The state repository factory</param>
        /// <param name="signalId">The is of the signal</param>
        /// <param name="tracer">The tracer.</param>
        public SmartSignalRunner(ISmartSignal smartSignal, IAnalysisServicesFactory analysisServicesFactory, IStateRepositoryFactory stateRepositoryFactory, string signalId, ITracer tracer)
        {
            this.smartSignal = smartSignal;
            this.analysisServicesFactory = analysisServicesFactory;
            this.Tracer = tracer;
            this.IsSignalRunning = false;
            this.stateRepositoryFactory = stateRepositoryFactory;
            this.signalId = signalId;
        }

        /// <summary>
        /// Gets the signal run's result.
        /// </summary>
        public SmartSignalResult Result
        {
            get
            {
                return this.result;
            }

            private set
            {
                this.result = value;
                this.OnPropertyChanged();
            }
        }

        /// <summary>
        /// Gets or sets the tracer used by the signal runner.
        /// </summary>
        public ITracer Tracer
        {
            get
            {
                return this.tracer;
            }

            set
            {
                this.tracer = value;
                this.OnPropertyChanged();
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the signal is running.
        /// </summary>
        public bool IsSignalRunning
        {
            get
            {
                return this.isSignalRunning;
            }

            set
            {
                this.isSignalRunning = value;
                this.OnPropertyChanged();
            }
        }

        /// <summary>
        /// Runs the smart signal.
        /// </summary>
        /// <param name="resources">The resources which the signal should run on.</param>
        /// <param name="analysisCadence">The analysis cadence.</param>
        /// <returns>A task that runs the smart signal.</returns>
        public async Task RunAsync(List<ResourceIdentifier> resources, TimeSpan analysisCadence)
        {
            this.cancellationTokenSource = new CancellationTokenSource();
            this.Result = null;

            IStateRepository stateRepository = this.stateRepositoryFactory.Create(this.signalId);
            var analysisRequest = new AnalysisRequest(resources, null, analysisCadence, this.analysisServicesFactory, stateRepository);
            try
            {
                this.IsSignalRunning = true;

                this.Result = await this.smartSignal.AnalyzeResourcesAsync(
                    analysisRequest,
                    this.Tracer,
                    this.cancellationTokenSource.Token);
            }
            catch (OperationCanceledException)
            {
                this.Tracer.TraceError("Signal run was canceled.");
            }
            catch (Exception e)
            {
                this.Tracer.ReportException(e);
            }
            finally
            {
                this.IsSignalRunning = false;
                this.cancellationTokenSource?.Dispose();
            }
        }

        /// <summary>
        /// Cancel signal run.
        /// </summary>
        public void CancelSignalRun()
        {
            this.cancellationTokenSource?.Cancel();
        }
    }
}
