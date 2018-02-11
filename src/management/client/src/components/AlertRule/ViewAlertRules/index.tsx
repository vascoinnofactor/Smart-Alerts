// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid } from 'react-flexbox-grid';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md/lib/DataTables';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import { Link } from 'react-router-dom';

import StoreState, { AlertRulesStoreState } from '../../../store/StoreState';
import { getAlertRules } from '../../../actions/alertRule/alertRuleActions';

import './indexStyle.css';

/**
 * Represents the ViewAlertRules component props for the dispatch functions
 */
interface ViewAlertRulesDispatchProps {
    getAlertRules: () => (dispatch: Dispatch<StoreState>) => Promise<void>;
}

/**
 * Represents the ViewAlertRules component props for the component inner state  
 */
interface ViewAlertRulesStateProps {
    alertRules: AlertRulesStoreState;
}

// Create a type combined from all the props
type ViewAlertRulesProps = ViewAlertRulesDispatchProps &
                           ViewAlertRulesStateProps;

class ViewAlertRules extends React.Component<ViewAlertRulesProps> {
    public async componentDidMount() {
        await this.props.getAlertRules();
    }

    public render() {
        return (
            <div>
                <Link to={'/alertRule/add'}>
                    <Button 
                        className="add-alert-rule-button" 
                        iconEl={<FontIcon>{'add'}</FontIcon>}
                    >
                        New Alert Rule
                    </Button>
                </Link>
                <Grid fluid className="view-alert-rules-container">
                    <DataTable plain>
                        <TableHeader>
                            <TableRow>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Description</TableColumn>
                                <TableColumn>Signal</TableColumn>
                                <TableColumn>Run interval</TableColumn>
                            </TableRow>
                        </TableHeader>
                        {
                            !this.props.alertRules.isFetching &&
                            this.props.alertRules.items.length > 0 &&
                            <TableBody>
                                {
                                    this.props.alertRules.items.map((alertRule, index) => (
                                        <TableRow 
                                            key={index}
                                        >
                                            <TableColumn>{alertRule.name}</TableColumn>
                                            <TableColumn>{alertRule.description}</TableColumn>
                                            <TableColumn>{alertRule.signalId}</TableColumn>
                                            <TableColumn>{alertRule.cadenceInMinutes}</TableColumn>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        }
                    </DataTable>
                        {
                                this.props.alertRules.isFetching &&
                                <div className="loading-alert-rules">
                                    <CircularProgress id="view-alert-rules-progress" />
                                </div>
                        }
                        {
                                !this.props.alertRules.isFetching &&
                                this.props.alertRules.failureReason &&
                                <div className="failed-get-alert-rules">
                                    <FontIcon className="error-icon">{'error'}</FontIcon>
                                    Failed to get alert rules :(
                                </div>
                        }
                </Grid>
            </div>
        );
    }
}

/**
 * Map between the given state to this component props.
 * @param state The current state
 */
function mapStateToProps(state: StoreState): ViewAlertRulesStateProps {
    return {
        alertRules: state.alertRules
    };
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<StoreState>): ViewAlertRulesDispatchProps {
    return {
        getAlertRules: bindActionCreators(getAlertRules, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAlertRules);