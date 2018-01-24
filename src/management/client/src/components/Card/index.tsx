// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Card as MDCard, CardTitle, CardText } from 'react-md/lib/Cards';
import { Tooltipped } from 'react-md/lib/Tooltips';
import { Moment } from 'moment';
import * as moment from 'moment';

import VisualizationFactory from '../../factories/VisualizationsFactory';
import ChartType from '../../enums/ChartType';
import ChartMetadata from '../../models/ChartMetadata';
import StoreState from '../../store/StoreState';
import DataTable from '../../models/DataTable';
import { getQueryResult } from '../../actions/queryResult/queryResultActions';

import './indexStyle.css';
import QueryRunInfo from '../../models/QueryRunInfo';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

/**
 * Represents the Card component props for the dispatch functions
 */
interface CardDispatchProps {
    executeQuery: (queryId: string, query: string, queryRunInfo: QueryRunInfo) =>
                  (dispatch: Dispatch<StoreState>, getState: () => StoreState) => Promise<void>;
}

/**
 * Represents the Card component props for the component inner state  
 */
interface CardStateProps {
    chartData?: DataTable;
}

/**
 * Represents the Card component props for the incoming properties
 */
interface CardOwnProps {
    title: string;
    presentedValue: string;
    bottomText: string;
    resourceName: string;
    timestamp: Moment;
    chartMetadata?: ChartMetadata;
    chartType?: ChartType;
    hideXAxis?: boolean;
    hideYAxis?: boolean;
    hideLegend?: boolean;
}

// Create a type combined from all the props
type CardProps = CardDispatchProps &
                 CardStateProps & 
                 CardOwnProps;

/**
 * This component represents a card which presents a title, sub-titles and a chart.
 */
class Card extends React.Component<CardProps> {
    private readonly CardTimestampFormat: string = 'MM/DD/YYYY HH:mm A';
    
    constructor(props: CardProps) {
        super(props);
    }

    public async componentDidMount() {
        if (this.props.chartMetadata) {
            await this.props.executeQuery(this.props.chartMetadata.id,
                                          this.props.chartMetadata.query,
                                          this.props.chartMetadata.queryRunInfo);
        }
    }

    public render() {
        const { title, presentedValue, bottomText, resourceName } = this.props;

        return (
            <div className="cardContainer">
                <MDCard>
                    <div className="cardHeader">
                        <Tooltipped label={title} position="top">
                            <CardTitle 
                                title=""
                                subtitle={title}
                                children={this.getHeaderInsightTimestampElement()}
                            />
                        </Tooltipped>
                    </div>
                    <CardText>
                        <div className="cardContent">
                            <div>
                                <div className="presentedValue">
                                    {presentedValue}
                                </div>
                                <div className="bottomText">
                                    {bottomText}
                                </div>
                                <div className="resourceName">
                                    {resourceName}
                                </div>
                            </div>
                            <div className="chart-container">
                                {
                                    !this.props.chartData &&
                                    <CircularProgress id={'loading-chart' + this.props.chartType}/>   
                                }
                                {
                                    this.props.chartData && this.props.chartType &&
                                    VisualizationFactory.create(this.props.chartType, this.props.chartData,
                                                                undefined, this.props.hideXAxis, this.props.hideYAxis,
                                                                this.props.hideLegend)
                                }
                            </div>
                        </div>
                    </CardText>
                </MDCard>
            </div>
        );
    }

    private getHeaderInsightTimestampElement(): JSX.Element {
        // TODO - convert the given timestamp to the required format
        return (
            <div className="insightTimestamp">
                {moment(this.props.timestamp).format(this.CardTimestampFormat)}
            </div>
        );
    }
}

/**
 * Map between the given state to this component props.
 * @param state The current state
 * @param ownProps the component's props
 */
function mapStateToProps(state: StoreState, ownProps: CardOwnProps): CardStateProps {
    let chartData: DataTable | undefined;

    // Get the chart data only if this card has chart
    if (ownProps.chartMetadata && state.queryResults) {
        let queryResult = state.queryResults.get(ownProps.chartMetadata.id);
        if (queryResult && queryResult.result) {
            chartData = queryResult.result;
        }
    }

    return {
        chartData: chartData
    };
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<StoreState>): CardDispatchProps {
    return {
        executeQuery: bindActionCreators(getQueryResult, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);