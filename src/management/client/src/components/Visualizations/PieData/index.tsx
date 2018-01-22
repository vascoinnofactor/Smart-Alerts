// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

import Visualization, { VisualizationProps } from '../VisualizationBase';
import PieChartData from '../../../models/Charts/PieChartData';

interface PieProps extends VisualizationProps {
    chartData: PieChartData;
}

/**
 * This component represents the pie visualization rendering
 */
export default class PieData extends Visualization<PieProps> {
    public render() {
        const { chartData, hideLegend } = this.props;

        return (
            <ResponsiveContainer>
                <PieChart>
                    <Pie 
                        data={chartData.data} 
                        dataKey={chartData.numericFields[0]} 
                        fill="#bd84d8" 
                        label={!hideLegend} 
                    >
                        {chartData.data.map((entry, index) => 
                            <Cell key={index} />)}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    }
}