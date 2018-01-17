// -----------------------------------------------------------------------
// <copyright file="signalResultDetails.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Col, Row } from 'react-flexbox-grid';
import * as moment from 'moment';

import { DateUtils } from '../../utils/DateUtils';
import SignalResult from '../../models/SignalResult';
import { SignalResultUtils } from '../../utils/SignalResultUtils';
import SignalResultProperty from '../../models/SignalResultProperty';
import StoreState from '../../store/StoreState';
import DataTable from '../../models/DataTable';
import ChartMetadata from '../../models/ChartMetadata';
import VisualizationFactory from '../../factories/VisualizationsFactory';
import { getQueryResult } from '../../actions/queryResult/queryResultActions';

import './signalResultDetailsStyle.css';

/**
 * Represents the SignalResultDetails component props for the dispatch functions
 */
interface SignalResultDetailsDispatchProps {
    executeQuery: (queryId: string, applicationId: string, query: string, apiKey: string) =>
                  (dispatch: Dispatch<StoreState>) => Promise<void>;
}

/**
 * Represents the Card component props for the component inner state  
 */
interface SignalResultDetailsStateProps {
    chartsData: Map<string, DataTable>;
}

/**
 * Represents the SignalResultDetails component props for the incoming properties
 */
interface SignalResultDetailsOwnProps {
    signalResult: SignalResult;
    chartsMetadata: ChartMetadata[];
}

// Create a type combined from all the props
type SignalResultDetailsProps = SignalResultDetailsDispatchProps &
                                SignalResultDetailsStateProps & 
                                SignalResultDetailsOwnProps;

/**
 * This component represents the Signal Result details view page
 */
class SignalResultDetails extends React.PureComponent<SignalResultDetailsProps> {
    constructor(props: SignalResultDetailsProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.chartsMetadata.forEach(async chart => {
            await this.props.executeQuery(chart.id,
                                          chart.applicationId,
                                          chart.query,
                                          chart.apiKey);
        });
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
                                {SignalResultUtils.getSubscriptionId(this.props.signalResult.resourceId)}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                Resource group
                            </Col>
                            <Col xs={10}>
                                {SignalResultUtils.getResourceGroup(this.props.signalResult.resourceId)}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                Resource
                            </Col>
                            <Col xs={10}>
                                {SignalResultUtils.getResourceName(this.props.signalResult.resourceId)}    
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                Rule name
                            </Col>
                            <Col xs={10}>
                                {this.props.signalResult.title}
                            </Col>
                        </Row>
                        <Row className="property-row">
                            <Col xs={2}>
                                When
                            </Col>
                            <Col xs={10}>
                                {DateUtils.getStartTimeAndEndTimeAsRange(
                                    moment(this.props.signalResult.analysisTimestamp)
                                                           .add(-this.props.signalResult.analysisWindowSizeInMinutes),
                                    moment(this.props.signalResult.analysisTimestamp))}
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
                                this.getChartsElements()
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

    private getChartsElements(): (JSX.Element | undefined)[] {
        return this.props.chartsMetadata.map(chartMetadata => {
            // Get the chart data
            let chartData = this.props.chartsData.get(chartMetadata.id);

            return (
                chartData &&
                VisualizationFactory.create(chartMetadata.chartType,
                                            chartData,
                                            'analysis-chart')
            );
        });
    }

    /**
     * Get the custom analysis properties section
     * @param signalResult The signal result
     */
    private customAnalysisProperties(signalResult: SignalResult): JSX.Element {
        let result: JSX.Element = (<div/>);

        let analysisProperties: SignalResultProperty[] = SignalResultUtils.getAllAnalysisProperties(signalResult);
        
        if (analysisProperties) {
            result = (
                <Grid fluid className="gridStyle properies-list">
                    {
                        analysisProperties.map((property, index) => (
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

/**
 * Map between the given state to this component props.
 * @param state The current state
 * @param ownProps the component's props
 */
function mapStateToProps(state: StoreState, ownProps: SignalResultDetailsOwnProps): SignalResultDetailsStateProps {
    let chartsData: Map<string, DataTable> = new Map<string, DataTable>();

    if (ownProps.chartsMetadata) {
        ownProps.chartsMetadata.forEach(chart => {
            let queryResult = state.queryResults.get(chart.id);
            if (queryResult) {
                chartsData.set(chart.id, queryResult.result);
            }
        });
    }

    return {
        chartsData: chartsData
    };
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<StoreState>): SignalResultDetailsDispatchProps {
    return {
        executeQuery: bindActionCreators(getQueryResult, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignalResultDetails);