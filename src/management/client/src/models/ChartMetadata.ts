// -----------------------------------------------------------------------
// <copyright file="ChartMetadata.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartType from './ChartType';

export default interface ChartMetadata {
    /**
     * Gets the chart data id (chart id)
     */
    id: string;

    /**
     * Gets the query string
     */
    query: string;

    /**
     * Gets the chart type
     */
    chartType: ChartType;

    /**
     * Gets the application id (in case query is against AI)
     */
    applicationId: string;

    /**
     * Gets the api key (in case query is against AI)
     */
    apiKey: string;
}