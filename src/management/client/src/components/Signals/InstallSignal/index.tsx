// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import FileUploader from '../../FileUploader';

import './indexStyle.css';

/**
 * This component represents the install signal page
 */
export default class InstallSignal extends React.Component {
    public render() {
        let circle = (
            <div className="circle" />
        );

        return (
            <div className="right-panel">
                <div className="details-container">
                    <div className="title">
                        INSTALL A SMART ALERT SIGNAL
                    </div>

                    <div className="upload-options">
                        <div className="upload-signal-container">
                            {circle}
                            <div className="upload-from-file-label">
                                INSTALL FROM FILE
                            </div>
                            <div className="upload-file-container">
                                Select a smart alert signal available as a binary file.
                                <FileUploader 
                                    textFieldClassName="file-name-field"
                                    installButtonClassName="install-button"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}