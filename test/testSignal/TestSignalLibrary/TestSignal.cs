//-----------------------------------------------------------------------
// <copyright file="TestSignal.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace TestSignalLibrary
{
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Monitoring.SmartAlerts;

    public class TestSignal : ISmartSignal
    {
        public Task<SmartSignalResult> AnalyzeResourcesAsync(AnalysisRequest analysisRequest, ITracer tracer, CancellationToken cancellationToken)
        {
            SmartSignalResult smartSignalResult = new SmartSignalResult();
            smartSignalResult.ResultItems.Add(new TestSignalResultItem("test title", analysisRequest.TargetResources.First()));
            return Task.FromResult(smartSignalResult);
        }
    }
}
