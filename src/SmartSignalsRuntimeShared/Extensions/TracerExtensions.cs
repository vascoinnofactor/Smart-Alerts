//-----------------------------------------------------------------------
// <copyright file="TracerExtensions.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.Extensions
{
    using System;
    using System.Diagnostics;
    using System.Linq;

    /// <summary>
    /// Extension methods for <see cref="ITracer"/> objects
    /// </summary>
    public static class TracerExtensions
    {
        private const string PerformanceCounterMetricPrefix = "SmartSignalsPerformanceCounter";

        /// <summary>
        /// Trace relevant performance counters as metrics.
        /// </summary>
        /// <param name="tracer">The tracer to use</param>
        public static void TracePerformanceCounters(this ITracer tracer)
        {
            try
            {
                PerformanceCounter[] counters =
                {
                    new PerformanceCounter("Objects", "Connections", true),
                    new PerformanceCounter("Objects", "NamedPipes", true),
                    new PerformanceCounter("Objects", "Mutexes", true),
                    new PerformanceCounter("Objects", "Processes", true),
                    new PerformanceCounter("Objects", "Sections", true),
                    new PerformanceCounter("Objects", "Semaphores", true),
                    new PerformanceCounter("Objects", "Threads", true),
                    new PerformanceCounter("Processor", "% Processor Time", "_Total", true),
                    new PerformanceCounter("Memory", "Available MBytes", true)
                };

                foreach (PerformanceCounter counter in counters)
                {
                    // The metric name is the counter's category and name, excluding non-letters
                    string metricName = PerformanceCounterMetricPrefix + new string((counter.CategoryName + "_" + counter.CounterName).Where(c => char.IsLetter(c) || c == '_').ToArray());

                    // Report the metric
                    tracer.ReportMetric(metricName, counter.NextValue());
                }
            }
            catch (Exception e)
            {
                tracer.TraceWarning($"Failed to trace performance counters: {e.Message}");
            }
        }
    }
}
