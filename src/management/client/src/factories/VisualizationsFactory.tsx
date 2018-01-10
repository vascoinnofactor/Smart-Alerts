// -----------------------------------------------------------------------
// <copyright file="VisualizationsFactory.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import Timeline from '../components/Visualizations/Timeline';
import Bars from '../components/Visualizations/Bars';
import PieData from '../components/Visualizations/PieData';
import ChartType from '../models/ChartType';

/**
 * A factory class that creates the required visualization component
 */
export default class VisualizationsFactory {
    public static create(chartType: ChartType, data: { time: string, number: number }[],
                         className?: string, hideXAxis?: boolean, hideYAxis?: boolean,
                         hideLegend?: boolean): JSX.Element {
        switch (chartType) {
            case ChartType.Timeline:
                return (
                            <Timeline 
                                data={data} 
                                className={className} 
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend} 
                            />
                        );
            case ChartType.bars:
                return (
                            <Bars
                                data={data}
                                className={className}
                                hideXAxis={hideXAxis} 
                                hideYAxis={hideYAxis}
                                hideLegend={hideLegend} 
                            />
                        );
            case ChartType.pie:
                return (
                            <PieData
                                data={data}
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
}