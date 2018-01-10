// -----------------------------------------------------------------------
// <copyright file="signalResultDetails.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Grid, Col, Row } from 'react-flexbox-grid';

import { DateUtils } from '../../utils/DateUtils';
import SignalResult from '../../models/SignalResult';
import VisualizationFactory from '../../factories/VisualizationsFactory';

import './signalResultDetailsStyle.css';

/**
 * Represents the SignalResultDetails component props
 */
interface SignalResultDetailsProps {
    signalResult: SignalResult;
}

/**
 * This component represents the Signal Result details view page
 */
export default class SignalResultDetails extends React.PureComponent<SignalResultDetailsProps> {
    constructor(props: SignalResultDetailsProps) {
        super(props);
    }

    public render() {
        return (
            <div className="details-container">
                <Grid fluid>
                    <Row className="title">
                        {this.props.signalResult.title}
                    </Row>
                    
                    <Row className="section-title">
                            SUMMARY
                    </Row>

                    <Grid fluid className="properies-list">
                        <Row className="property-row">
                            <Col xs={2}>
                                Subscription
                            </Col>
                            <Col xs={10}>
                                {!this.props.signalResult.subscriptionId ?
                                        'N/A' : this.props.signalResult.subscriptionId}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                Resource group
                            </Col>
                            <Col xs={10}>
                                {!this.props.signalResult.resourceGroup ? 'N/A' : this.props.signalResult.resourceGroup}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                Resource
                            </Col>
                            <Col xs={10}>
                                {this.props.signalResult.resourceName}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                Rule name
                            </Col>
                            <Col xs={10}>
                                {this.props.signalResult.name}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                When
                            </Col>
                            <Col xs={10}>
                                {DateUtils.getStartTimeAndEndTimeAsRange(this.props.signalResult.startTime,
                                                                         this.props.signalResult.endTime)}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                Metric
                            </Col>
                            <Col xs={10}>
                                {this.props.signalResult.summaryProperty.value}
                            </Col>
                        </Row>
                    </Grid>
                </Grid>
                
                <Grid fluid className="gridStyle analysis-chart-section">
                    <Row className="section-title">
                            ANALYSIS
                    </Row>
                    
                    <Grid fluid>
                        <Row className="chart-container">
                            {
                                this.props.signalResult.chartType && this.props.signalResult.chartData &&
                                VisualizationFactory.create(this.props.signalResult.chartType,
                                                            this.props.signalResult.chartData,
                                                            'analysis-chart')
                            }
                        </Row>
                    </Grid>
                </Grid>
                
                <Grid fluid className="analysis-additional-properties-section">
                    {this.customAnalysisProperties(this.props.signalResult)}
                </Grid>

                <Grid fluid className="analysis-additional-properties-section">
                    {this.actionsSection(this.props.signalResult)}
                </Grid>
            </div>
        );
    }

    /**
     * Get the custom analysis properties section
     * @param signalResult The signal result
     */
    private customAnalysisProperties(signalResult: SignalResult): JSX.Element {
        let result: JSX.Element = (<div/>);

        if (signalResult.analysisProperties) {
            result = (
                <Grid fluid className="gridStyle properies-list">
                    {
                        signalResult.analysisProperties.map((property, index) => (
                            <Row className="property-row">
                                <Col xs={2}>
                                    {property.name}
                                </Col>
                                <Col xs={10}>
                                    {property.value}
                                </Col>
                            </Row>
                        ))
                    }
                </Grid>
            );
        }

        return result;
    }

    /**
     * Get the action section
     * @param signalResult The signal result
     */
    private actionsSection(signalResult: SignalResult): JSX.Element {
        return (
            <Grid fluid className="gridStyle properies-list">
                <Row className="section-title">
                        ACTIONS
                </Row>
                
                <Grid fluid>
                    <Row>
                        hiiiii
                    </Row>
                </Grid>
            </Grid>
        );
    }
}