// -----------------------------------------------------------------------
// <copyright file="TimelineChart.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartDataBase from './ChartDataBase';

export default interface TimelineChart extends ChartDataBase {
    lines: string[];

    timestampColumnName: string;
}