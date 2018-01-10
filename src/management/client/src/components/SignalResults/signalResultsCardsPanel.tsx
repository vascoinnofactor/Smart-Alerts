// -----------------------------------------------------------------------
// <copyright file="signalResultsCardsPanel.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Link } from 'react-router-dom';

import Card from '../Card';

import SignalResult from '../../models/SignalResult';

import './indexStyle.css';

/**
 * Represents the SignalResultsCardsPanel component props for the incoming properties 
 */
interface SignalResultsCardsPanelProps {
    signalResults: SignalResult[];
}

/**
 * This component represents the signals results cards panel
 */
export default class SignalResultsCardsPanel extends React.Component<SignalResultsCardsPanelProps> {
    constructor(props: SignalResultsCardsPanelProps) {
        super(props);

        this.getInsightsCards = this.getInsightsCards.bind(this);
    }

    public render() {
        return (
            <div>
                {this.getInsightsCards()}
            </div>
        );
    }

    private getInsightsCards(): JSX.Element[] {
        return this.props.signalResults.map((signalResult, index) => (
            <div>
                <Link to={'/signalResults/' + index}>
                    <Card 
                        title={signalResult.title}
                        presentedValue={signalResult.summaryProperty.value}
                        bottomText={signalResult.name}
                        resourceName={signalResult.resourceName}
                        data={signalResult.chartData}
                        chartType={signalResult.chartType}
                        hideXAxis
                        hideYAxis
                        hideLegend
                    />
                </Link>
            </div>
        ));
    }
}