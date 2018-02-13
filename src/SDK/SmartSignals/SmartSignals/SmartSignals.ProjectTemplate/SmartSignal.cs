using System.Linq;
using Microsoft.Azure.Monitoring.SmartSignals;
using System.Threading;
using System.Threading.Tasks;

namespace $safeprojectname$
{
	public class SmartSignal: ISmartSignal
    {   
        public Task<SmartSignalResult> AnalyzeResourcesAsync(AnalysisRequest analysisRequest, ITracer tracer, CancellationToken cancellationToken)
        {
            SmartSignalResult smartSignalResult = new SmartSignalResult();
            smartSignalResult.ResultItems.Add(new SmartSignalResultItem("title", analysisRequest.TargetResources.First()));
            return Task.FromResult(smartSignalResult);
        }

    }
}