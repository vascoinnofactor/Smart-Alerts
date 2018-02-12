// -----------------------------------------------------------------------
// <copyright file="signalResultDetailsDrawerView.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Col, Row } from 'react-flexbox-grid';
import * as moment from 'moment';
import { LinearProgress } from 'react-md/lib/Progress';

import SignalResult from '../../models/SignalResult';
import ChartMetadata from '../../models/ChartMetadata';
import { SignalResultUtils } from '../../utils/SignalResultUtils';
import { DateUtils } from '../../utils/DateUtils';
import SignalResultProperty from '../../models/SignalResultProperty';
import VisualizationFactory from '../../factories/VisualizationsFactory';
import DataTable from '../../models/DataTable';
import QueryRunInfo from '../../models/QueryRunInfo';
import StoreState from '../../store/StoreState';
import { getQueryResult } from '../../actions/queryResult/queryResultActions';

import './signalResultDetailsDrawerViewStyle.css';
import { Tooltipped } from 'react-md/lib/Tooltips';

/**
 * Represents the SignalResultDetails component props for the dispatch functions
 */
interface SignalResultDetailsDrawerViewDispatchProps {
    executeQuery: (queryId: string, query: string, queryRunInfo: QueryRunInfo) =>
                  (dispatch: Dispatch<StoreState>, getState: () => StoreState) => Promise<void>;
}

/**
 * Represents the Card component props for the component inner state  
 */
interface SignalResultDetailsDrawerViewStateProps {
    chartsData: Map<string, DataTable>;
}

/**
 * Represents the SignalResultDetailsDrawerView component props for the incoming properties
 */
interface SignalResultDetailsDrawerViewOwnProps {
    signalResult: SignalResult;
    chartsMetadata: ChartMetadata[];
}

type SignalResultDetailsDrawerViewProps = SignalResultDetailsDrawerViewStateProps &
                                          SignalResultDetailsDrawerViewOwnProps &
                                          SignalResultDetailsDrawerViewDispatchProps;
                                          
class SignalResultDetailsDrawerView extends React.Component<SignalResultDetailsDrawerViewProps> {
    public componentDidMount() {
        // TODO - merge with componentwillRecieveProps
        this.props.chartsMetadata.forEach(async chart => {
            if (!this.props.chartsData.has(chart.id)) {
                await this.props.executeQuery(chart.id,
                                              chart.query,
                                              chart.queryRunInfo);
            }
        });
    }

    public componentWillReceiveProps(nextProps: Readonly<SignalResultDetailsDrawerViewProps>) {
        if (nextProps.signalResult !== this.props.signalResult) {
            nextProps.chartsMetadata.forEach(async chart => {
                if (!this.props.chartsData.has(chart.id)) {
                    await this.props.executeQuery(chart.id,
                                                  chart.query,
                                                  chart.queryRunInfo);
                }
            });
        }
    }

    public render() {
        return (
            <div>
                <Grid fluid>
                    <Row className="title">
                        {this.props.signalResult.title}
                    </Row>
                    
                    <Row className="section-title">
                            ESSENTIALS
                    </Row>

                    <Row className="property-row">
                        <Col xs={4}>
                            Subscription
                        </Col>
                        <Col xs={8}>
                            {SignalResultUtils.getSubscriptionId(this.props.signalResult.resourceId)}
                        </Col>
                    </Row>
                    <Row className="property-row">
                        <Col xs={4}>
                            Resource group
                        </Col>
                        <Col xs={8}>
                            {SignalResultUtils.getResourceGroup(this.props.signalResult.resourceId)}
                        </Col>
                    </Row>
                    <Row className="property-row">
                        <Col xs={4}>
                            Resource
                        </Col>
                        <Col xs={8}>
                            {SignalResultUtils.getResourceName(this.props.signalResult.resourceId)}    
                        </Col>
                    </Row>
                    <Row className="property-row">
                        <Col xs={4}>
                            Rule name
                        </Col>
                        <Col xs={8}>
                            {this.props.signalResult.title}
                        </Col>
                    </Row>
                    <Row className="property-row">
                        <Col xs={4}>
                            When
                        </Col>
                        <Col xs={8}>
                            {DateUtils.getStartTimeAndEndTimeAsRange(
                                moment(this.props.signalResult.analysisTimestamp)
                                                        .add(-this.props.signalResult.analysisWindowSizeInMinutes),
                                moment(this.props.signalResult.analysisTimestamp))}
                        </Col>
                    </Row>

                    <Row className="section-title">
                            ANALYSIS
                    </Row>

                    {this.customAnalysisProperties(this.props.signalResult)}

                    <div className="chart-container">
                            {
                                this.getChartsElements()
                            }
                    </div>
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
                        key={chartMetadata.id}
                        className="linear-progress-container"
                        progressClassName="linear-progress" 
                    />   
                );
            } else if (chartData.data.length === 0) {
                presentedValue = (<div/>);
            } else {
                presentedValue = VisualizationFactory.create(chartMetadata.chartType,
                                                             chartData,
                                                             'analysis-chart',
                                                             undefined,
                                                             undefined,
                                                             undefined,
                                                             300,
                                                             chartMetadata.name);
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
                <div>
                    {
                        signalResultProperties.map((property, index) => (
                            <Row className="property-row">
                                <Col xs={4} className="property-key">
                                    <Tooltipped label={property.name} position="top">   
                                        <div>
                                            {property.name}
                                        </div>
                                    </Tooltipped>
                                </Col>
                                <Col xs={8}>
                                    {property.value}
                                </Col>
                            </Row>
                        ))
                    }
                </div>
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
function mapStateToProps(state: StoreState,
                         ownProps: SignalResultDetailsDrawerViewOwnProps): SignalResultDetailsDrawerViewStateProps {
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
function mapDispatchToProps(dispatch: Dispatch<StoreState>): SignalResultDetailsDrawerViewDispatchProps {
    return {
        executeQuery: bindActionCreators(getQueryResult, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignalResultDetailsDrawerView);