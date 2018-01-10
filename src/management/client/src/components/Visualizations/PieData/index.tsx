// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

import Visualization from '../VisualizationBase';

/**
 * This component represents the pie visualization rendering
 */
export default class PieData extends Visualization {
    public render() {
        const { data, hideLegend } = this.props;

        return (
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="number" fill="#bd84d8" label={!hideLegend} />
                </PieChart>
            </ResponsiveContainer>
        );
    }
}