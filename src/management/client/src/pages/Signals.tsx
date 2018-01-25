// -----------------------------------------------------------------------
// <copyright file="Signals.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import Signals from '../components/Signals';

/**
 *  Represents the SignalsPage component props
 */
interface SignalsPageProps {
    selectedSignalNumber: number | null;
}

/**
 * This component represents the page of the signals view
 */
export default class SignalsPage extends React.Component<SignalsPageProps> {
    constructor(props: SignalsPageProps) {
        super(props);
    }

    render() {
        return (
            <Signals selectedSignalNumber={this.props.selectedSignalNumber}/>
        );
    }
}