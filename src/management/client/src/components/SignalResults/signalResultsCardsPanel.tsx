// -----------------------------------------------------------------------
// <copyright file="signalResultsCardsPanel.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Link } from 'react-router-dom';

import Card from '../Card';

import SignalResult from '../../models/SignalResult';
import { SignalResultUtils } from '../../utils/SignalResultUtils';
import { ChartMetadataUtils } from '../../utils/ChartMetadataUtils';
import ChartMetadata from '../../models/ChartMetadata';
import { SignalResultPropertyUtils } from '../../utils/SignalResultPropertyUtils';

import './indexStyle.css';

/**
 * Represents the SignalResultsCardsPanel component props for the incoming properties 
 */
interface SignalResultsCardsPanelProps {
    signalResults: ReadonlyArray<SignalResult>;
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
        if (!this.props.signalResults || this.props.signalResults.length === 0) {
            return Element[0];
        }

        return this.props.signalResults.map((signalResult, index) => {
            let cardChartMetadata: ChartMetadata | undefined;

            if (signalResult.summary.chart) {
                let cardChartId: string = ChartMetadataUtils.createChartId(signalResult.id,
                                                                           signalResult.summary.chart.value);
                cardChartMetadata = ChartMetadataUtils
                                    .createChartMetadata(cardChartId,
                                                         signalResult.summary.chart.value,
                                                         '2fee53af-477f-4e55-b1db-32ddbfdbe33c',
                                                         'ismhkjiwsuyz1rhn52krjxeumasxmox1wspdp1yk',
                                                         SignalResultPropertyUtils
                                                            .getChartTypeFromProperty(signalResult.summary.chart));

            }

            return (
                <div key={signalResult.id}>
                    <Link to={'/signalResults/' + index}>
                        <Card 
                            chartMetadata={cardChartMetadata}
                            title={signalResult.title}
                            presentedValue={signalResult.summary.value}
                            bottomText={signalResult.summary.details}
                            resourceName={SignalResultUtils.getResourceName(signalResult.resourceId)}
                            timestamp={signalResult.analysisTimestamp}
                            chartType={SignalResultPropertyUtils.getChartTypeFromProperty(signalResult.summary.chart)}
                            hideXAxis
                            hideYAxis
                            hideLegend
                        />
                    </Link>
                </div>
            );
        });
    }
}