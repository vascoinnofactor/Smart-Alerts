// -----------------------------------------------------------------------
// <copyright file="ChartMetadata.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { DataSource } from '../enums/DataSource';
import ChartType from '../enums/ChartType';

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
     * Gets the data source where the data is placed (currently Application Insights / Log Analytics)
     */
    dataSource: DataSource;
}