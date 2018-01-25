// -----------------------------------------------------------------------
// <copyright file="ChartDataFactory.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import DataTable from '../models/DataTable';

import timelineChartFormatter from '../data-formats/timeline';
import pieDataFormat from '../data-formats/pie';
import barsDataFormat from '../data-formats/bars';

import ChartType from '../enums/ChartType';
import ChartDataBase from '../models/Charts/ChartDataBase';

/**
 * A factory class that creates the required chart data
 */
export default class ChartDataFactory {
    public static createChartData(dataTable: DataTable, chartType: ChartType): ChartDataBase {
        switch (chartType) {
            case ChartType.Timeline:
                return timelineChartFormatter(dataTable);
            case ChartType.Pie:
                return pieDataFormat(dataTable);
            case ChartType.Bars:
                return barsDataFormat(dataTable);
            default:
                throw new Error('Not supported chart type');
        }
    }
}