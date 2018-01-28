// -----------------------------------------------------------------------
// <copyright file="signalResultsCardsPanel.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

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
    selectedCardId?: number;
}

/**
 * This component represents the signals results cards panel
 */
export default class SignalResultsCardsPanel extends React.Component<SignalResultsCardsPanelProps> {
    constructor(props: SignalResultsCardsPanelProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                {this.getSignalResultCards(this.props.signalResults, this.props.selectedCardId)}
            </div>
        );
    }

    private getSignalResultCards(signalResults: ReadonlyArray<SignalResult>,
                                 selectedCardId?: number): JSX.Element[] {
        if (!signalResults || signalResults.length === 0) {
            return [(<CircularProgress id="signal-results-cards"/>)];
        }

        return signalResults.map((signalResult, index) => {
            let cardChartMetadata: ChartMetadata | undefined;

            if (signalResult.summary.chart) {
                let cardChartId: string = ChartMetadataUtils.createChartId(signalResult.id,
                                                                           signalResult.summary.chart.value);
                cardChartMetadata = ChartMetadataUtils
                                    .createChartMetadata(cardChartId,
                                                         signalResult.summary.chart.value,
                                                         signalResult.queryRunInfo,
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
                            // tslint:disable-next-line:triple-equals
                            isSelected={selectedCardId ? index == selectedCardId : false}
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