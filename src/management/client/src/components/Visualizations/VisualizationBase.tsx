// -----------------------------------------------------------------------
// <copyright file="VisualizationBase.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import * as moment from 'moment';
import { ResponsiveContainer } from 'recharts';

import './VisualizationBaseStyle.css';

/**
 * This component represents the visualization components global properties
 */
export interface VisualizationProps {
    className?: string;
    hideXAxis?: boolean;
    hideYAxis?: boolean;
    hideLegend?: boolean;
    height?: number;
    chartName?: string;
}

/**
 * This component represents the visualization base class
 */
export default abstract class Visualization<T extends VisualizationProps> extends React.Component<T> {
    constructor(props: T) {
        super(props);
    }

    public render() {
        return (
            <div className="chart-container">
                <div className="title">
                    {this.props.chartName}
                </div>
                <ResponsiveContainer height={this.props.height}>
                    {this.renderVisualization()}
                </ResponsiveContainer>
            </div>
        );
    }

    protected abstract renderVisualization(): JSX.Element;

    protected hourFormat(time: string) {
        return moment(time).format('HH:mm');
    }
}