// -----------------------------------------------------------------------
// <copyright file="signalResultDetailsPanel.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Route } from 'react-router-dom';

import SignalResult from '../../models/SignalResult';
import SignalResultDetails from './signalResultDetails';
import { SignalResultUtils } from '../../utils/SignalResultUtils';
import ChartMetadata from '../../models/ChartMetadata';
import SignalResultProperty from '../../models/SignalResultProperty';
import { SignalResultPropertyUtils } from '../../utils/SignalResultPropertyUtils';
import { ChartMetadataUtils } from '../../utils/ChartMetadataUtils';

/**
 * Represents the SignalResultDetailsPanel component props
 */
interface SignalResultDetailsPanelProps {
    signalResult?: SignalResult;
}

/**
 * This component represents the inner view of the signal result page (without the filtering bar)
 */
export default class SignalResultDetailsPanel extends React.Component<SignalResultDetailsPanelProps> {
    constructor(props: SignalResultDetailsPanelProps) {
        super(props);
    }

    public render() {
        return (
            <div className="right-panel">
                {
                    !this.props.signalResult &&
                    <div className="no-insight-to-show"> 
                        Select an issue to see more details
                    </div>
                }
                {
                    (
                        <Route 
                            path="/signalResults/:resultId"
                            render={(props) => {
                                // In case no signal result exists - do nothing
                                if (!this.props.signalResult) {
                                    return (
                                        <div/>
                                    );
                                }

                                let allChartsProperties = SignalResultUtils
                                                            .getAllChartProperties(this.props.signalResult);
                                let chartsMetadata = this.getChartsMetadata(this.props.signalResult,
                                                                            allChartsProperties);
                                return (
                                    this.props.signalResult && 
                                    <SignalResultDetails
                                        signalResult={this.props.signalResult}
                                        chartsMetadata={chartsMetadata}
                                    />
                                );
                            }}
                        />
                    )
                }
            </div>
        );
    }

    private getChartsMetadata(signalResult: SignalResult, chartsProperties: SignalResultProperty[]): ChartMetadata[] {
        return chartsProperties.map(property => {
            return {
                id: ChartMetadataUtils.createChartId(signalResult.id, property.name, property.value),
                applicationId: '2fee53af-477f-4e55-b1db-32ddbfdbe33c',
                apiKey: 'ismhkjiwsuyz1rhn52krjxeumasxmox1wspdp1yk',
                query: property.value,
                chartType: SignalResultPropertyUtils.getChartTypeFromProperty(property)
            } as ChartMetadata;
        });
    }
}