// -----------------------------------------------------------------------
// <copyright file="ChartMetadataUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartMetadata from '../models/ChartMetadata';
import ChartType from '../enums/ChartType';
import QueryRunInfo from '../models/QueryRunInfo';

/**
 * A utility class for ChartMetadata functions
 */
export class ChartMetadataUtils {
    /**
     * Create the chart metadata
     * @param id The chart id
     * @param query The chart query
     * @param queryRunInfo The chart query run info
     * @param chartType The chart type
     */
    public static createChartMetadata(id: string, query: string, queryRunInfo: QueryRunInfo,
                                      chartType: ChartType): ChartMetadata {
        return {
            id: id,
            chartType: chartType,
            query: query,
            queryRunInfo: queryRunInfo
        };
    }

    /**
     * Create a chart id by the given parameters
     */
    public static createChartId(...ids: string[]) {
        return ids.join('-');
    }
}