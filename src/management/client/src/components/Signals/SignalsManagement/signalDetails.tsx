// -----------------------------------------------------------------------
// <copyright file="signalDetails.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { SelectionControl } from 'react-md/lib/SelectionControls';
import { Button } from 'react-md/lib/Buttons';
import { TextField } from 'react-md/lib/TextFields';
import { SelectField } from 'react-md/lib/SelectFields';

import Signal from '../../../models/Signal';

import './signalDetailsStyle.css';

/**
 * Represents the SignalDetails component props for the incoming properties 
 */
interface SignalDetailsProps {
    signal: Signal;
}

/**
 * This components represents the signal details view
 */
export default class SignalDetails extends React.Component<SignalDetailsProps> {
    constructor(props: SignalDetailsProps) {
        super(props);
    }
    
    public render() {
        return (
            <div className="details-container">
                <div className="title">
                    EDIT SIGNAL - {this.props.signal.name.toUpperCase()}
                </div>

                <div className="signal-enabled-section">
                    Enabled
                    <SelectionControl 
                        id="signalEnabled"
                        name="signalEnabled"
                        type="switch"
                        className="selection-control" 
                    />
                </div>

                <div className="signal-run-every-section">
                    Run every
                    <TextField style={{ width: '100px' }} />
                    <SelectField id="cadence" placeholder="Cadence" menuItems={['hours', 'days']} /> 
                </div>
                
                <div className="alert-email-configuration-section">
                    Send email when raised to
                    <SelectionControl 
                        id="sent-alert-mail"
                        name="sent-alert-mail"
                        label="Resource owners, contributers and readers"
                        className="check-box"
                        type="checkbox"
                    />
                    <SelectionControl 
                        id="additional-recipients"
                        name="sent-alert-mail-to-additional-recipients"
                        label="Additional recipients"
                        className="check-box"
                        type="checkbox"	
                    />
                    <div className="additional-recipients-container">
                        <input 
                            type="text"
                            name="additional-recipients-mails"
                            placeholder="Seperated by ;" 
                            className="additional-recipients"
                        />
                    </div>
                    <div className="save-cancel-buttons">
                        <Button flat primary swapTheming className="save-button">Save</Button>
                        <Button flat primary swapTheming className="cancel-button">Cancel</Button>
                    </div>
                </div>
            </div>
        );
    }
}