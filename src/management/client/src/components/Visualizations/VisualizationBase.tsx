// -----------------------------------------------------------------------
// <copyright file="VisualizationBase.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import * as moment from 'moment';

/**
 * This component represents the visualization components global properties
 */
export interface VisualizationProps {
    className?: string;
    hideXAxis?: boolean;
    hideYAxis?: boolean;
    hideLegend?: boolean;
}

/**
 * This component represents the visualization base class
 */
export default abstract class Visualization<T> extends React.Component<T> {
    constructor(props: T) {
        super(props);
    }

    protected hourFormat(time: string) {
        return moment(time).format('HH:mm');
    }
}