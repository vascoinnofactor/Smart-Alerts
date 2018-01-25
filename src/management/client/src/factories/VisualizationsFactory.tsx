// -----------------------------------------------------------------------
// <copyright file="VisualizationsFactory.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import Timeline from '../components/Visualizations/Timeline';
import Bars from '../components/Visualizations/Bars';
import PieData from '../components/Visualizations/PieData';
import ChartType from '../enums/ChartType';
import DataTable from '../models/DataTable';
import ChartDataFactory from './ChartDataFactory';
import TimelineChart from '../models/Charts/TimelineChart';
import BarsChart from '../models/Charts/BarsChart';
import PieChartData from '../models/Charts/PieChartData';

/**
 * A factory class that creates the required visualization component
 */
export default class VisualizationsFactory {
    public static create(chartType: ChartType, data: DataTable,
                         className?: string, hideXAxis?: boolean, hideYAxis?: boolean,
                         hideLegend?: boolean, height?: number): JSX.Element {     
        switch (chartType) {
            case ChartType.Timeline:
                return (
                            <Timeline 
                                timelineChart={ChartDataFactory.createChartData(data, chartType) as TimelineChart}
                                className={className} 
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend} 
                                height={height}
                            />
                        );
            case ChartType.Bars:
                return (
                            <Bars
                                chartData={ChartDataFactory.createChartData(data, chartType) as BarsChart}
                                className={className}
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend} 
                                height={height}
                            />
                        );
            case ChartType.Pie:
                return (
                            <PieData
                                chartData={ChartDataFactory.createChartData(data, chartType) as PieChartData}
                                className={className}
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend}
                                height={height}
                            />  
                        );
            default:
                return (<div/>);
        }
    }
}