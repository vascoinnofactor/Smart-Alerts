// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Route } from 'react-router-dom';
import { Grid, Col, Row } from 'react-flexbox-grid';
import { Moment } from 'moment';
import * as moment from 'moment';

import SignalResultsCardsPanel from './signalResultsCardsPanel';
import SignalResultDetailsPanel from './signalResultDetailsPanel';
import SignalResultsFilters from './signalResultsFilters';

import StoreState from '../../store/StoreState';

import SignalResult from '../../models/SignalResult';

import { getSignalsResults } from '../../actions/signalResult/signalResultActions';

import './indexStyle.css';

/**
 * Represents the SignalResultPresentation component props for the dispatch functions
 */
interface SignalResultPresentationDispatchProps {
    refreshSignalsResults: (startTime: Moment) => (dispatch: Dispatch<StoreState>) => Promise<void>;
}

/**
 * Represents the SignalResultPresentation component props for the component inner state  
 */
interface SignalResultPresentationStateProps {
    signalsResults: ReadonlyArray<SignalResult>;
}

/**
 * Represents the SignalResultPresentation component props for the incoming properties
 */
interface SignalResultPresentationOwnProps {
    selectedSignalResultNumber: number | null;
}

// Create a type combined from all the props
type SignalResultPresentationProps = SignalResultPresentationDispatchProps &
                                     SignalResultPresentationStateProps & 
                                     SignalResultPresentationOwnProps;

/**
 * This component represents ths main view of the Smart Signal Result screen
 */
class SignalResultPresentation extends React.PureComponent<SignalResultPresentationProps> {
    /**
     * Once component mount, refresh the signals results list
     */
    public async componentDidMount() {
        await this.props.refreshSignalsResults(moment.utc());
    }

    public render() {
        const { signalsResults, selectedSignalResultNumber } = this.props;

        const d = [ 'subscriptionId', 'something very long sldfkjlsdkjflsdkjf' ];
        return (
            <div className="signal-result-container panel">
                <div className="sub-menu-container" >
                    <SignalResultsFilters subscriptions={d}/>
                </div>
 
                <Grid fluid className="signal-result-panel">
                    <Row className="signal-result-content">
                        <Col xs={3} className="signal-result-cards-panel">
                            <div>
                                <SignalResultsCardsPanel 
                                    signalResults={signalsResults}
                                    selectedCardId={selectedSignalResultNumber !== null ?
                                                        selectedSignalResultNumber :
                                                        undefined}
                                />
                            </div>
                        </Col>

                        <Col xs className="signal-result-details-panel">
                            <Route 
                                render={(props) => (
                                    <SignalResultDetailsPanel 
                                        signalResult={this.props.selectedSignalResultNumber ? 
                                                    signalsResults[this.props.selectedSignalResultNumber] : 
                                                    undefined}
                                    />
                                )} 
                            />
                        </Col>  
                    </Row>
                </Grid>
            </div>
        );
    }
}

/**
 * Map between the given state to this component props.
 * @param state The current state
 * @param ownProps the component's props
 */
function mapStateToProps(state: StoreState, ownProps: SignalResultPresentationOwnProps)
    : SignalResultPresentationStateProps {
    return {
        signalsResults: state.signalsResults.items,
    };
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<StoreState>): SignalResultPresentationDispatchProps {
    return {
        refreshSignalsResults: bindActionCreators(getSignalsResults, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignalResultPresentation);