// -----------------------------------------------------------------------
// <copyright file="TimelineChart.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartDataBase from './ChartDataBase';

/**
 * Represents the model of a timeline chart
 */
export default interface TimelineChart extends ChartDataBase {
    /**
     * Gets the timeline chart lines series
     */
    linesDataKeys: string[];

    /**
     * Gets the timestamp data key (for x axis)
     */
    timestampDataKey: string;
}