// -----------------------------------------------------------------------
// <copyright file="SignalResultPropertyUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ChartType from '../enums/ChartType';
import SignalResultProperty from '../models/SignalResultProperty';
import { PropertyCategory } from '../enums/PropertyCategory';

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
        
        let queryLastWord = signalResultProperty.value.split(' ').pop();

        switch (queryLastWord) {
            case 'barchart':
                return ChartType.Bars;
            case 'timechart':
                return ChartType.Timeline;
            case 'piechat':
                return ChartType.Pie;
            default:
                return ChartType.Timeline;
        }
    }
}
