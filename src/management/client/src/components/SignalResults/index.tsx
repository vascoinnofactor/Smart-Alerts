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

import SignalResultsCardsPanel from './signalResultsCardsPanel';
import SignalResultDetailsPanel from './signalResultDetailsPanel';
import SignalResultsFilters from './signalResultsFilters';

import StoreState from '../../store/StoreState';

import SignalResult from '../../models/SignalResult';

import { getSignalsResults } from '../../actions/signalResult/signalResultActions';

import './style.css';

// TODO - this will be removed once integration with BE will be over
// const data03 = [
//     { time: 'Jan 04 2016', number: 1.35 },
//     { time: 'Jan 05 2016', number: 102.71 },
//     { time: 'Jan 06 2016', number: 60.7 },
//     { time: 'Jan 07 2016', number: 96.45 },
//     { time: 'Jan 08 2016', number: 23.96 },
//     { time: 'Jan 11 2016', number: 98.53 },
//     { time: 'Jan 12 2016', number: 35.96 },
//     { time: 'Jan 13 2016', number: 97.39 },
//     { time: 'Jan 14 2016', number: 78.52 }
// ];

// const data04 = [
//     { time: 'Jan 04 2016', number: 96.35 },
//     { time: 'Jan 05 2016', number: 99.71 },
//     { time: 'Jan 06 2016', number: 100.7 },
//     { time: 'Jan 07 2016', number: 96.45 },
//     { time: 'Jan 08 2016', number: 13.96 },
//     { time: 'Jan 11 2016', number: 98.53 },
//     { time: 'Jan 12 2016', number: 12.96 },
//     { time: 'Jan 13 2016', number: 97.39 },
//     { time: 'Jan 14 2016', number: 14.52 }
// ];

/**
 * Represents the SignalResultPresentation component props for the dispatch functions
 */
interface SignalResultPresentationDispatchProps {
    refreshSignalsResults: () => (dispatch: Dispatch<StoreState>) => Promise<void>;
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
class SignalResultPresentation extends React.Component<SignalResultPresentationProps> {
    /**
     * Once component mount, refresh the signals results list
     */
    public async componentDidMount() {
        await this.props.refreshSignalsResults();
    }

    public render() {
        const { signalsResults } = this.props;

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
                                <SignalResultsCardsPanel signalResults={signalsResults} />
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