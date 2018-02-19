// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import Visualization, { VisualizationProps } from '../VisualizationBase';
import BarsChart from '../../../models/Charts/BarsChart';

interface BarsProps extends VisualizationProps {
    chartData: BarsChart;
}

/**
 * This component represents the bars visualization rendering
 */
export default class Bars extends Visualization<BarsProps> {
    protected renderVisualization(): JSX.Element {
        const { chartData, hideLegend, hideYAxis, hideXAxis, className } = this.props;
        
        return (
            <BarChart 
                    data={chartData.data} 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }} 
                    className={className}
            >
                <XAxis 
                    dataKey={chartData.xAxisDataKey} 
                    tickFormatter={this.hourFormat} 
                    minTickGap={20}
                    hide={hideXAxis}
                />
                <YAxis 
                    type="number"
                    hide={hideYAxis} 
                />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                <Tooltip />
                {
                    !hideLegend &&
                    <Legend />
                }
                {this.createBarElements(chartData.barsDataKeys)}
            </BarChart>
        );
    }

    /**
     * Create a bar element for each series
     * @param data the chart data
     */
    private createBarElements(lines: string[]): JSX.Element[] {
        var lineElements: JSX.Element[] = [];
        if (lines && lines.length > 0) {
          lineElements = lines.map((line, idx) => {
            return (
              <Bar
                key={idx}
                dataKey={line}
                fill="#8884d8"
              />
            );
          });
        }

        return lineElements;
    }
}