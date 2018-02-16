//-----------------------------------------------------------------------
// <copyright file="AnalyticsQuery.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.Models
{
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.IO.Compression;
    using System.Text;
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels;

    /// <summary>
    /// Represents an App Analytics query.
    /// </summary>
    public class AnalyticsQuery
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AnalyticsQuery"/> class.
        /// </summary>
        /// <param name="description">The query description</param>
        /// <param name="url">The URL with the query</param>
        public AnalyticsQuery(string description, string url)
        {
            this.Description = description;
            this.Url = url;
        }

        /// <summary>
        /// Gets the query description.
        /// </summary>
        public string Description { get; }

        /// <summary>
        /// Gets the URL with the query.
        /// </summary>
        public string Url { get; }
    }
}
