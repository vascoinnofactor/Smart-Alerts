// -----------------------------------------------------------------------
// <copyright file="signalsView.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid } from 'react-flexbox-grid';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md/lib/DataTables';
import { CircularProgress } from 'react-md/lib/Progress';

import StoreState, { SignalsStoreState } from '../../../store/StoreState';
import { getSignals } from '../../../actions/signal/signalActions';

import './signalsViewStyle.css';
import FormatUtils from '../../../utils/FormatUtils';

/**
 * Represents the SignalsView component props for the dispatch functions
 */
interface SignalsViewDispatchProps {
    getSignals: () => (dispatch: Dispatch<StoreState>) => Promise<void>;
}

/**
 * Represents the SignalsView component props for the component inner state  
 */
interface SignalsViewStateProps {
    signals: SignalsStoreState;
}

// Create a type combined from all the props
type SignalsViewProps = SignalsViewDispatchProps & 
                        SignalsViewStateProps;

class SignalsView extends React.Component<SignalsViewProps> {
    constructor(props: SignalsViewProps) {
        super(props);
    }

    public async componentDidMount() {
        await this.props.getSignals();
    }

    public render() {
        return (
            <div>
                <Grid fluid className="signals-view-container">
                    <div className="page-title">
                        Signals
                    </div>

                    <div className="signals-presentation-and-filters">
                        <DataTable selectableRows={false} className="signals-table"> 
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Supported cadences</TableColumn>
                                    <TableColumn>Supported resource types</TableColumn>
                                </TableRow>
                            </TableHeader>
                            {
                                this.props.signals.items.length > 0 &&
                                <TableBody>
                                    {
                                        this.props.signals.items.map((signal, index) => (
                                            <TableRow key={index}>
                                                <TableColumn>{signal.name}</TableColumn>
                                                <TableColumn>{signal.supportedCadences.map(cadence => 
                                                        FormatUtils.minutesToStringPresentation(cadence)).join(', ')}
                                                </TableColumn>
                                                <TableColumn>{signal.supportedResourceTypes.join(', ')}</TableColumn>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            }
                        </DataTable>

                        {
                                this.props.signals.items.length === 0 &&
                                <div className="loading-signals">
                                    <CircularProgress id="view-signals-progress" />
                                </div>
                        }
                        </div>
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
function mapStateToProps(state: StoreState): SignalsViewStateProps {
    return {
        signals: state.signals,
    };
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */ 
function mapDispatchToProps(dispatch: Dispatch<StoreState>): SignalsViewDispatchProps {
    return {
        getSignals: bindActionCreators(getSignals, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignalsView);