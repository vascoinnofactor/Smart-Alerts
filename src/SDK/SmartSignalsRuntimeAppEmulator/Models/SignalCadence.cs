//-----------------------------------------------------------------------
// <copyright file="SignalCadence.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Emulator.Models
{
    using System;
    using Microsoft.Azure.Monitoring.SmartAlerts.Emulator.Extensions;

    /// <summary>
    /// Represents a time cadence for a signal run.
    /// </summary>
    public class SignalCadence
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SignalCadence"/> class.
        /// </summary>
        /// <param name="timeSpan">The cadence time span</param>
        public SignalCadence(TimeSpan timeSpan)
        {
            this.TimeSpan = timeSpan;
            this.DisplayName = timeSpan.ToReadableString();
        }

        /// <summary>
        /// Gets the cadence time span.
        /// </summary>
        public TimeSpan TimeSpan { get; }

        /// <summary>
        /// Gets the cadence display name.
        /// </summary>
        public string DisplayName { get; }
    }
}
