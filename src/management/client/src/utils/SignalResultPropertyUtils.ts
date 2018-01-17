// -----------------------------------------------------------------------
// <copyright file="SignalResultPropertyUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartType from '../models/ChartType';
import SignalResultProperty, { PropertyCategory } from '../models/SignalResultProperty';

/**
 * A utility class for SignalResultProperty object
 */
export class SignalResultPropertyUtils {
    /**
     * Gets the chart type from the given Signal Result property
     * @param signalResultProperty The signal result property
     */
    public static getChartTypeFromProperty(signalResultProperty: SignalResultProperty): ChartType {
        if (!signalResultProperty || signalResultProperty.displayCategory !== PropertyCategory.Chart) {
            return ChartType.None;
        }
        
        switch (signalResultProperty.name) {
            case 'Bar Chart':
                return ChartType.Bars;
            case 'Time Chart':
                return ChartType.Timeline;
            case 'Pie Chart':
                return ChartType.Timeline;
            default:
                return ChartType.Timeline;
        }
    }
}
