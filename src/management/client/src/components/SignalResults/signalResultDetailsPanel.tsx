// -----------------------------------------------------------------------
// <copyright file="signalResultDetailsPanel.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Route } from 'react-router-dom';

import SignalResult from '../../models/SignalResult';
import SignalResultDetails from './signalResultDetails';

/**
 * Represents the SignalResultDetailsPanel component props
 */
interface SignalResultDetailsPanelProps {
    signalResult?: SignalResult;
}

/**
 * This component represents the inner view of the signal result page (without the filtering bar)
 */
export default class SignalResultDetailsPanel extends React.Component<SignalResultDetailsPanelProps> {
    constructor(props: SignalResultDetailsPanelProps) {
        super(props);
    }

    public render() {
        return (
            <div className="right-panel">
                {
                    !this.props.signalResult &&
                    <div className="no-insight-to-show"> 
                        Select an issue to see more details
                    </div>
                }
                {
                    this.props.signalResult && (
                        <Route 
                            path="/signalResults/:resultId"
                            render={(props) => 
                                        (
                                            this.props.signalResult && 
                                            <SignalResultDetails signalResult={this.props.signalResult} />
                                        )
                                   }
                        />
                    )
                }
            </div>
        );
    }
}