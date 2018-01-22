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
import * as H from 'history';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

import { DateUtils } from '../../utils/DateUtils';
import SignalResult from '../../models/SignalResult';
import { SignalResultUtils } from '../../utils/SignalResultUtils';
import SignalResultProperty from '../../models/SignalResultProperty';
import StoreState from '../../store/StoreState';
import DataTable from '../../models/DataTable';
import ChartMetadata from '../../models/ChartMetadata';
import VisualizationFactory from '../../factories/VisualizationsFactory';
import { getQueryResult } from '../../actions/queryResult/queryResultActions';
import { DataSource } from '../../enums/DataSource';

import './signalResultDetailsStyle.css';

/**
 * Represents the SignalResultDetails component props for the dispatch functions
 */
interface SignalResultDetailsDispatchProps {
    executeQuery: (queryId: string, applicationId: string, query: string, dataSource: DataSource) =>
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
    location: H.Location;
}

// Create a type combined from all the props
type SignalResultDetailsProps = SignalResultDetailsDispatchProps &
                                SignalResultDetailsStateProps & 
                                SignalResultDetailsOwnProps;

/**
 * This component represents the Signal Result details view page
 */
class SignalResultDetails extends React.Component<SignalResultDetailsProps> {
    constructor(props: SignalResultDetailsProps) {        
        super(props);

        this.getChartsElements = this.getChartsElements.bind(this);
    }

    public componentWillReceiveProps(nextProps: Readonly<SignalResultDetailsProps>) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            nextProps.chartsMetadata.forEach(async chart => {
                if (!this.props.chartsData.has(chart.id)) {
                    await this.props.executeQuery(chart.id,
                                                  chart.applicationId,
                                                  chart.query,
                                                  chart.dataSource);
                }
            });
        }
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
            </div>
        );
    }

    private getChartsElements(): (JSX.Element | undefined)[] {
        if (!this.props.chartsMetadata) {
            return Element[0];
        }
        
        return this.props.chartsMetadata.map(chartMetadata => {
            // Get the chart data
            let chartData = this.props.chartsData.get(chartMetadata.id);

            let presentedValue: JSX.Element;
            if (!chartData) {
                presentedValue = (
                    <LinearProgress 
                        id={chartMetadata.id} 
                        className="linear-progress-container"
                        progressClassName="linear-progress" 
                    />   
                );
            } else {
                presentedValue = VisualizationFactory.create(chartMetadata.chartType,
                                                             chartData,
                                                             'analysis-chart');
            }

            return presentedValue;
        });
    }

    /**
     * Get the custom analysis properties section
     * @param signalResult The signal result
     */
    private customAnalysisProperties(signalResult: SignalResult): JSX.Element {
        let result: JSX.Element = (<div/>);

        let signalResultProperties: SignalResultProperty[] = SignalResultUtils.getAllProperties(signalResult);
        
        if (signalResultProperties && signalResultProperties.length > 0) {
            result = (
                <Grid fluid className="gridStyle properies-list">
                    {
                        signalResultProperties.map((property, index) => (
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
}

/**
 * Map between the given state to this component props.
 * @param state The current state
 * @param ownProps the component's props
 */
function mapStateToProps(state: StoreState, ownProps: SignalResultDetailsOwnProps): SignalResultDetailsStateProps {
    let chartsData: Map<string, DataTable> = new Map<string, DataTable>();

    if (ownProps.chartsMetadata && state.queryResults) {
        ownProps.chartsMetadata.forEach(chart => {
            let queryResult = state.queryResults.get(chart.id);
            if (queryResult && queryResult.result) {
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