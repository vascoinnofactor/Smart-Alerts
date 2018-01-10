// -----------------------------------------------------------------------
// <copyright file="signalsList.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import FontIcon from 'react-md/lib/FontIcons';
import { Link } from 'react-router-dom';

import Signal from '../../../models/Signal';

import './signalsListStyle.css';

/**
 * Represents the SignalsList component props for the incoming properties 
 */
interface SignalsListProps {
    signals: ReadonlyArray<Signal>;
}

/**
 * This component represents the view of the signals list
 */
export default class SignalsList extends React.Component<SignalsListProps> {
    constructor(props: SignalsListProps) {
        super(props);
    }

    public render() {
        const signalsList = this.props.signals.map((signal, index) => (
            <div className="signal">
                <FontIcon className="signal-status">done</FontIcon>
                <div className="signal-name">
                    <Link to={'/signals/' + index}>
                        {signal.name}
                    </Link>
                </div>
            </div>
        ));

        return (
            <div>
                <div className="signal-list-title">
                        SIGNAL NAME
                </div>
                {signalsList}
            </div>
        );
    }
}