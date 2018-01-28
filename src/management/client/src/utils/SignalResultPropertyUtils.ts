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
    private static findRenderTypeRegex = new RegExp('.*render\\s(\\w*)');

    /**
     * Gets the chart type from the given Signal Result property
     * @param signalResultProperty The signal result property
     */
    public static getChartTypeFromProperty(signalResultProperty: SignalResultProperty): ChartType {
        if (!signalResultProperty || signalResultProperty.displayCategory !== PropertyCategory.Chart) {
            return ChartType.None;
        }
        
        // In case no 'render' command mentioned - choose timeline as default 
        if (!this.findRenderTypeRegex.test(signalResultProperty.value)) {
            return ChartType.Timeline;
        }

        let regexResults = this.findRenderTypeRegex.exec(signalResultProperty.value);
        if (!regexResults || regexResults.length === 0) {
            return ChartType.None;
        }

        let chartRenderType: string = regexResults[1];

        switch (chartRenderType) {
            case 'barchart':
                return ChartType.Bars;
            case 'timechart':
                return ChartType.Timeline;
            case 'piechart':
                return ChartType.Pie;
            default:
                return ChartType.None;
        }
    }
}
