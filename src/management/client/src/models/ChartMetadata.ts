// -----------------------------------------------------------------------
// <copyright file="ChartMetadata.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartType from '../enums/ChartType';
import QueryRunInfo from './QueryRunInfo';

export default interface ChartMetadata {
    /**
     * Gets the chart data id (chart id)
     */
    id: string;

    /**
     * The chart name
     */
    name: string;
    
    /**
     * Gets the query string
     */
    query: string;

    /**
     * Gets the chart type
     */
    chartType: ChartType;

    /**
     * Gets the information about the queries run
     */
    queryRunInfo: QueryRunInfo;
}