// -----------------------------------------------------------------------
// <copyright file="BarsChart.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartDataBase from './ChartDataBase';

/**
 * Represents the model of a bars chart
 */
export default interface BarsChart extends ChartDataBase {
    /**
     * Gets the x axis data key
     */
    xAxisDataKey: string;

    /**
     * Gets the bars data keys (which we should render a bar for)
     */
    barsDataKeys: string[];
}