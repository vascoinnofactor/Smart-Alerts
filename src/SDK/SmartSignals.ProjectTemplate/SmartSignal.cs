namespace $safeprojectname$
{
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartSignals;

/// <summary>
/// The base class for representing Smart Signal
/// </summary>
public class SmartSignal : ISmartSignal
    {
        /// <summary>
        /// Initiates an asynchronous operation for analyzing the smart signal on the specified resources.
        /// </summary>
        /// <param name="analysisRequest">The analysis request data.</param>
        /// <param name="tracer">
        /// A tracer used for emitting telemetry from the signal's execution. This telemetry will be used for troubleshooting and
        /// monitoring the signal's executions.
        /// </param>
        /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for a task to complete.</param>
        /// <returns>
        /// A <see cref="Task"/> that represents the asynchronous operation, returning the Signal result for the target resources. 
        /// </returns>
        public Task<SmartSignalResult> AnalyzeResourcesAsync(AnalysisRequest analysisRequest, ITracer tracer, CancellationToken cancellationToken)
        {
            SmartSignalResult smartSignalResult = new SmartSignalResult();
            smartSignalResult.ResultItems.Add(new SmartSignalResultItem("title", analysisRequest.TargetResources.First()));
            return Task.FromResult(smartSignalResult);
        }
    }
}