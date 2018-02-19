// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { PieChart, Pie } from 'recharts';

import Visualization, { VisualizationProps } from '../VisualizationBase';
import PieChartData from '../../../models/Charts/PieChartData';

interface PieProps extends VisualizationProps {
    chartData: PieChartData;
}

/**
 * This component represents the pie visualization rendering
 */
export default class PieData extends Visualization<PieProps> {
    protected renderVisualization(): JSX.Element {
        const { chartData, hideLegend } = this.props;

        return (
            <PieChart>
                <Pie 
                    data={chartData.data} 
                    dataKey={chartData.numericDataKeys[0]} 
                    nameKey={chartData.sectorDataKeys[0]}
                    fill="#bd84d8" 
                    label={!hideLegend} 
                />
            </PieChart>
        );
    }
}