// -----------------------------------------------------------------------
// <copyright file="ChartDataBase.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * Represents the base model of a chart
 */
export default interface ChartData {
    /**
     * Gets the chart data
     */
    data: {}[];

    /**
     * Gets the numeric data keys
     */
    numericDataKeys: string[];
}