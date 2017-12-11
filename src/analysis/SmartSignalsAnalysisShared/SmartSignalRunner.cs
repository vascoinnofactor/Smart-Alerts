﻿namespace Microsoft.Azure.Monitoring.SmartSignals.Analysis
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;
    using Microsoft.Azure.Monitoring.SmartSignals.Analysis.DetectionPresentation;
    using Microsoft.Azure.Monitoring.SmartSignals.Shared;

    /// <summary>
    /// An implementation of <see cref="ISmartSignalRunner"/>, that loads the signal and runs it
    /// </summary>
    public class SmartSignalRunner : ISmartSignalRunner
    {
        private readonly ISmartSignalsRepository smartSignalsRepository;
        private readonly ISmartSignalLoader smartSignalLoader;
        private readonly ISmartSignalAnalysisServicesFactory smartSignalAnalysisServicesFactory;
        private readonly ITracer tracer;

        /// <summary>
        /// Initializes a new instance of the <see cref="SmartSignalRunner"/> class
        /// </summary>
        /// <param name="smartSignalsRepository">The smart signals repository</param>
        /// <param name="smartSignalLoader">The smart signals loader</param>
        /// <param name="smartSignalAnalysisServicesFactory">The smart signals analysis factory</param>
        /// <param name="tracer">The tracer</param>
        public SmartSignalRunner(ISmartSignalsRepository smartSignalsRepository, ISmartSignalLoader smartSignalLoader, ISmartSignalAnalysisServicesFactory smartSignalAnalysisServicesFactory, ITracer tracer)
        {
            this.smartSignalsRepository = Diagnostics.EnsureArgumentNotNull(() => smartSignalsRepository);
            this.smartSignalLoader = Diagnostics.EnsureArgumentNotNull(() => smartSignalLoader);
            this.smartSignalAnalysisServicesFactory = Diagnostics.EnsureArgumentNotNull(() => smartSignalAnalysisServicesFactory);
            this.tracer = tracer;
        }

        #region Implementation of ISmartSignalRunner

        /// <summary>
        /// Loads the signal, runs it, and returns the generated detections
        /// </summary>
        /// <param name="request">The signal request</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>A <see cref="Task{TResult}"/>, returning the detections generated by the signal</returns>
        public async Task<List<SmartSignalDetectionPresentation>> RunAsync(SmartSignalRequest request, CancellationToken cancellationToken)
        {
            // Read the signal's metadata
            this.tracer.TraceInformation($"Loading signal metadata for signal ID {request.SignalId}");
            SmartSignalMetadata signalMetadata = await this.smartSignalsRepository.ReadSignalMetadataAsync(request.SignalId);
            this.tracer.TraceInformation($"Read signal metadata, ID {signalMetadata.Id}, Version {signalMetadata.Version}");

            // Load the signal
            ISmartSignal signal = await this.smartSignalLoader.LoadSignalAsync(signalMetadata);
            this.tracer.TraceInformation($"Signal instance created successfully, ID {signalMetadata.Id}");

            // Determine the analysis window
            TimeRange analysisWindow = new TimeRange(request.AnalysisStartTime, request.AnalysisEndTime);
            this.tracer.TraceInformation($"Signal analysis window is: {analysisWindow}");

            // TODO: handle resources
            List<ResourceIdentifier> resources = request.ResourceIds.Select(resourceId => new ResourceIdentifier(ResourceType.VirtualMachine, resourceId, resourceId, resourceId)).ToList();

            // Create the analysis services
            ISmartSignalAnalysisServices analysisServices = await this.smartSignalAnalysisServicesFactory.CreateAsync(resources);

            // Run the signal
            this.tracer.TraceInformation($"Started running signal ID {signalMetadata.Id}, Name {signalMetadata.Name}");
            List<SmartSignalDetection> detections;
            try
            {
                detections = await signal.AnalyzeResourcesAsync(resources, analysisWindow, analysisServices, this.tracer, cancellationToken);
                this.tracer.TraceInformation($"Completed running signal ID {signalMetadata.Id}, Name {signalMetadata.Name}, returning {detections.Count} detections");
            }
            catch (Exception e)
            {
                this.tracer.TraceInformation($"Failed running signal ID {signalMetadata.Id}, Name {signalMetadata.Name}: {e.Message}");
                throw;
            }

            // Trace the number of detections of each type
            foreach (var typeDetections in detections.GroupBy(x => x.GetType().Name))
            {
                this.tracer.TraceInformation($"Got {typeDetections.Count()} detections of type '{typeDetections.Key}'");
                this.tracer.ReportMetric("SignalDetectionType", typeDetections.Count(), new Dictionary<string, string>() { { "DetectionType", typeDetections.Key } });
            }

            // And return the detections
            return detections.Select(detection => SmartSignalDetectionPresentation.CreateFromDetection(request, signalMetadata.Name, detection)).ToList();
        }

        #endregion
    }
}