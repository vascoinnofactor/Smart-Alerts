// -----------------------------------------------------------------------
// <copyright file="DataSource.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * List all the possible property category values.
 */
export enum DataSource {
    /**
     * Indicates the data source is in Application Insights
     */
    ApplicationInsights = 0,

    /**
     * Indicates the data source type is in Log Analytics
     */
    LogAnalytics = 1,
}