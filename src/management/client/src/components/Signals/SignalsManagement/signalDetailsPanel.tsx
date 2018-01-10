// -----------------------------------------------------------------------
// <copyright file="signalDetailsPanel.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Route } from 'react-router-dom';

import Signal from '../../../models/Signal';
import SignalDetails from './signalDetails';

/**
 * Represents the SignalDetailsPanel component props for the incoming properties 
 */
interface SignalDetailsPanelProps {
    signal?: Signal;
}

/**
 * This component represents the inner view of the signals page (without the upper bar)
 */
export default class SignalDetailsPanel extends React.Component<SignalDetailsPanelProps> {
    public render() {
        return (
            <div className="right-panel">
            {
                !this.props.signal &&
                <div className="no-insight-to-show"> 
                    Select an alert signal to edit its settings
                </div>
            }
            {
                this.props.signal && (
                    <Route 
                        path="/signals/:signalId"
                        render={(props) => 
                                    (
                                        this.props.signal && 
                                        <SignalDetails signal={this.props.signal} />
                                    )
                               }
                    />
                )
            }
            </div>
        );
    }
}