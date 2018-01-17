// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Visualization, { VisualizationProps } from '../VisualizationBase';
import FormatUtils from '../../../utils/FormatUtils';

interface TimelineProps extends VisualizationProps {
    timestampDataKey: string;
}

/**
 * This component represents the timeline visualization rendering
 */
export default class Timeline extends Visualization<TimelineProps> {
    public render() {
        const { data } = this.props;

        return (
            <ResponsiveContainer>
                <LineChart 
                           data={data} 
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }} 
                           className={this.props.className}
                >
                    <XAxis 
                        dataKey={this.props.timestampDataKey} 
                        tickFormatter={this.hourFormat} 
                        minTickGap={20} 
                        hide={this.props.hideXAxis}
                    />
                    <YAxis 
                        dataKey="number"
                        type="number"
                        tickFormatter={FormatUtils.kmNumber}
                        hide={this.props.hideYAxis} 
                    />
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                    <Tooltip />
                    {
                        !this.props.hideLegend &&
                        <Legend />
                    }
                    <Line dataKey="number" key="timeValue" type="monotone" strokeWidth={2} dot={false} />
                    {this.createLineElements(this.props.data)}
                </LineChart>
            </ResponsiveContainer>
        );
    }

    /**
     * Create a line element for each series
     * @param data The chart data
     */
    private createLineElements(data: object[]): JSX.Element[] {
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
              <Line
                stroke="#ff7300"
                strokeWidth={9}
                key={idx}
                type="monotone"
                dataKey={line}
                dot={false}
              />
            );
          });
        }

        return lineElements;
    }
}