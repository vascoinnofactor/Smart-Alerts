// -----------------------------------------------------------------------
// <copyright file="VisualizationsFactory.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import Timeline from '../components/Visualizations/Timeline';
import Bars from '../components/Visualizations/Bars';
import PieData from '../components/Visualizations/PieData';
import ChartType from '../models/ChartType';
import DataTable from '../models/DataTable';
import ChartRawData from '../components/Visualizations/Models/ChartRawData';

/**
 * A factory class that creates the required visualization component
 */
export default class VisualizationsFactory {
    public static create(chartType: ChartType, data: DataTable,
                         className?: string, hideXAxis?: boolean, hideYAxis?: boolean,
                         hideLegend?: boolean): JSX.Element {     
        // Convert the numeric values to chart data
        let chartData: ChartRawData[] = this.convertToChartRawDataArray(data.numericValues);

        switch (chartType) {
            case ChartType.Timeline:
                return (
                            <Timeline 
                                data={chartData} 
                                timestampDataKey={data.timeColumnName}
                                className={className} 
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend} 
                            />
                        );
            case ChartType.Bars:
                return (
                            <Bars
                                data={chartData}
                                className={className}
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend} 
                            />
                        );
            case ChartType.Pie:
                return (
                            <PieData
                                data={chartData}
                                className={className}
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend}
                            />  
                        );
            default:
                return (<div/>);
        }
    }

    /**
     * Convert the given values map to a chart raw data.
     * Each raw will contain the column name and the raw value.
     * @param valuesMap The values map
     */
    private static convertToChartRawDataArray(valuesMap: Map<string, number[]>): ChartRawData[] {
        let chartData: ChartRawData[] = [];
        
        Object.keys(valuesMap).forEach((key, index) => {
            // Get all the numeric values for this entry
            let values: number[] = valuesMap[index];

            // Add all the values with this key
            values.forEach(value => {
                chartData.fill({
                    name: key,
                    value: value
                });
            });
        });

        return chartData;
    }
}