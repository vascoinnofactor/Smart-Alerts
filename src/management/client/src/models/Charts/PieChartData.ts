// -----------------------------------------------------------------------
// <copyright file="PieChartData.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartDataBase from './ChartDataBase';

/**
 * Represents the model of a pie chart
 */
export default interface PieChartData extends ChartDataBase {
    /**
     * Gets the sectors data keys
     */
    sectorDataKeys: string[];
}