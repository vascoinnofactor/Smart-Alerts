// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Col, Row } from 'react-flexbox-grid';

import Signal from '../../../models/Signal';
import SignalsList from './signalsList';
import SignalDetailsPanel from './signalDetailsPanel';
import StoreState from '../../../store/StoreState';

import { getSignals } from '../../../actions/signal/signalActions';

import './indexStyle.css';

/**
 * Represents the SignalsManagement component props for the dispatch functions
 */
interface SignalsManagementDispatchProps {
    refreshSignals: () => (dispatch: Dispatch<StoreState>) => Promise<void>;
}

/**
 * Represents the SignalsManagement component props for the component inner state  
 */
interface SignalsManagementStateProps {
    signals: ReadonlyArray<Signal>;
}

/**
 * Represents the SignalsManagement component props for the incoming properties 
 */
interface SignalsManagementOwnProps {
    selectedSignalNumber: number | null;
}

// Create a type combined from all the props
type signalsManagementProps = SignalsManagementDispatchProps & 
                              SignalsManagementStateProps &
                              SignalsManagementOwnProps;

/**
 * This component represents the main view of the Smart Signals screen
 */
export class SignalsManagement extends React.Component<signalsManagementProps> {
    constructor(props: signalsManagementProps) {
        super(props);
    }
    
    /**
     * Once component mount, refresh the signals list
     */
    public async componentDidMount() {
        await this.props.refreshSignals();
    }

    public render() {
        const { signals, selectedSignalNumber } = this.props;

        return (
            <div className="managementContainer">
                <Grid fluid className="managementContainer">
                    <Row className="managementContainerContent">
                        <Col xs={3} className="signalsList">
                            <SignalsList signals={signals}/>
                        </Col>

                        <Col xs>
                            <SignalDetailsPanel 
                                signal={selectedSignalNumber ? 
                                       signals[selectedSignalNumber] : 
                                       undefined} 
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
function mapStateToProps(state: StoreState, ownProps: SignalsManagementOwnProps): SignalsManagementStateProps {
    return {
        signals: state.signals.items,
    };
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<StoreState>): SignalsManagementDispatchProps {
    return {
        refreshSignals: bindActionCreators(getSignals, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignalsManagement);