import * as React from 'react';
import * as moment from 'moment';

/**
 * This component represents the visualization components global properties
 */
interface VisualizationProps {
    data: object[];
    className?: string;
    hideXAxis?: boolean;
    hideYAxis?: boolean;
    hideLegend?: boolean;
}

/**
 * This component represents the visualization base class
 */
export default abstract class Visualization extends React.Component<VisualizationProps> {
    constructor(props: VisualizationProps) {
        super(props);
    }

    protected hourFormat(time: string) {
        return moment(time).format('HH:mm');
    }
}