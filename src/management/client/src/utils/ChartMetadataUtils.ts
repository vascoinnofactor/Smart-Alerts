// -----------------------------------------------------------------------
// <copyright file="ChartMetadataUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartMetadata from '../models/ChartMetadata';
import ChartType from '../enums/ChartType';
import { DataSource } from '../enums/DataSource';

/**
 * A utility class for ChartMetadata functions
 */
export class ChartMetadataUtils {
    public static createChartMetadata(id: string, query: string, applicationId: string,
                                      chartType: ChartType, dataSource: DataSource): ChartMetadata {
        return {
            id: id,
            chartType: chartType,
            applicationId: applicationId,
            query: query,
            dataSource: dataSource
        };
    }

    public static createChartId(...ids: string[]) {
        return ids.join('-');
    }
}