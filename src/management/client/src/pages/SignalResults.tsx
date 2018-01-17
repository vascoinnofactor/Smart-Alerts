// -----------------------------------------------------------------------
// <copyright file="SignalResults.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import SignalResults from '../components/SignalResults';

/**
 *  Represents the SignalResultsPage component props
 */
interface SignalResultsPageProps {
    selectedSignalResultNumber: number | null;
}

/**
 * This component represents the page of the signals results view
 */
export default class SignalResultsPage extends React.Component<SignalResultsPageProps> {
    constructor(props: SignalResultsPageProps) {
        super(props);
    }
    
    public render() {
        return (
            <SignalResults selectedSignalResultNumber={this.props.selectedSignalResultNumber} />
        );
    }
}