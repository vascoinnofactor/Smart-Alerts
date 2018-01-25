// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import ManagementSubMenu from './SignalsManagement/managementSubMenu';
import SignalsManagement from './SignalsManagement';
import InstallSignal from './InstallSignal';

import './indexStyle.css';

/**
 * Represents the Signals component props for the incoming properties 
 */
interface SignalsProps {
    selectedSignalNumber: number | null;
}

/**
 * This component represents the main view of the signals page
 */
export default class Signals extends React.Component<SignalsProps> {
    constructor(props: SignalsProps) {
        super(props);
    }

    public render() {
        return (
            <div className="panel management-panel">
                <div className="sub-menu-container" >
                    <ManagementSubMenu />
                </div>
                <Switch>
                    <Route path="/signals/install" component={InstallSignal} />
                    <Route
                        path="/signals/:id?" 
                        render={(props) => (
                            <SignalsManagement selectedSignalNumber={this.props.selectedSignalNumber} />
                        )}
                    />
                </Switch>
            </div>
        );
    }
}