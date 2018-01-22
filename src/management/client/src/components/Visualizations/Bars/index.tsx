// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Visualization, { VisualizationProps } from '../VisualizationBase';
import FormatUtils from '../../../utils/FormatUtils';
import BarsChart from '../../../models/Charts/BarsChart';

interface BarsProps extends VisualizationProps {
    chartData: BarsChart;
}

/**
 * This component represents the bars visualization rendering
 */
export default class Timeline extends Visualization<BarsProps> {
    public render() {
        const { chartData, hideLegend, hideYAxis, hideXAxis, className } = this.props;
        
        return (
            <ResponsiveContainer>
                <BarChart 
                        data={chartData.data} 
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }} 
                        className={className}
                >
                    <XAxis 
                        dataKey="time" 
                        tickFormatter={this.hourFormat} 
                        minTickGap={20} 
                        hide={hideXAxis}
                    />
                    <YAxis 
                        dataKey="number"
                        type="number"
                        tickFormatter={FormatUtils.kmNumber}
                        hide={hideYAxis} 
                    />
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                    <Tooltip />
                    <Tooltip />
                    {
                        !hideLegend &&
                        <Legend />
                    }
                    <Bar 
                        dataKey="number"
                        key="timeValue"
                        strokeWidth={2}
                        fill="#8884d8"
                    />
                    {this.createBarElements(chartData.data)}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    /**
     * Create a bar element for each series
     * @param data the chart data
     */
    private createBarElements(data: object[]): JSX.Element[] {
        // 1. Calculates which fields we should create lines for
        let fields: string[] = [];
        for (var key in data[0]) {
            // Ignore 'time' and 'number' fields
            if (key !== 'time' && key !== 'number') {
                fields.push(key);
            }
        }

        // 2. Create the lines
        var lineElements: JSX.Element[] = [];
        if (fields && fields.length > 0) {
          lineElements = fields.map((line, idx) => {
            return (
              <Bar
                key={idx}
                dataKey={line}
              />
            );
          });
        }

        return lineElements;
    }
}