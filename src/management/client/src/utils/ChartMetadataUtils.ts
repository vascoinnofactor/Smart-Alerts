// -----------------------------------------------------------------------
// <copyright file="ChartMetadataUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartMetadata from '../models/ChartMetadata';
import ChartType from '../models/ChartType';

/**
 * A utility class for ChartMetadata functions
 */
export class ChartMetadataUtils {
    public static createChartMetadata(id: string, query: string, applicationId: string,
                                      apiKey: string, chartType: ChartType): ChartMetadata {
        return {
            id: id,
            chartType: chartType,
            applicationId: applicationId,
            query: query,
            apiKey: apiKey
        };
    }

    public static createChartId(...ids: string[]) {
        return ids.join('-');
    }
}