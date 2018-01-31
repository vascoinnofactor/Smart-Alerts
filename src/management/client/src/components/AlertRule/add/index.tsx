// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';

import Drawer from '../../Drawer';
import AzureResourcesViewer from '../../AzureResourcesViewer';
import SignalsList from '../../Signals/SignalsManagement/signalsList';

import './indexStyle.css';

interface AddAlertRuleState {
    showResourcesDrawer: boolean;
    showSignalsDrawer: boolean;
}

export default class AddAlertRule extends React.Component<{}, AddAlertRuleState> {
    constructor() {
        super({});

        this.state = {
            showResourcesDrawer: false,
            showSignalsDrawer: false
        };
    }

    public render() {
        return (
            <div>
                <Grid fluid className="add-alert-rule-container">
                    <div className="create-rule-title">
                        Create rule
                    </div>
                    <div className="create-rule-sub-title">
                        Rules management
                    </div>
                    {/* The first section - define alert rule resources */}
                    <Row className="alert-rule-section-header">
                        1. Define alert information
                    </Row>

                    <div className="alert-rule-resources-description">
                        Define an alert condition by first specifying the target resource and then choosing 
                        signal(s) to monitor along with the logic for trigger criteria
                    </div>

                    <div className="text-before-input-box">
                        * Target resource
                    </div>
                    <input type="text" name="target-resources" id="target-resources" />
                    <div>
                        <a href="#" onClick={this.showAzureResourcesDrawer}>Select resource</a>
                    </div>

                    <div className="text-before-input-box target-signal-header">
                        * Target signal
                    </div>
                    <div className="no-signal-choosed">
                        No signal choosed, click on 'Choose signal' to select a signal
                    </div>
                    <div>
                        <a href="#" onClick={this.showSignalsListDrawer}>Select signal</a>
                    </div>

                    {/* The second section - define alert rule details */}
                    <Row className="alert-rule-section-header new-section">
                        2. Define alert details
                    </Row>

                    <div className="text-before-input-box">
                        Alert rule name
                    </div>
                    <input 
                        type="text"
                        placeholder="Specify alert name, Sample: 'Percentage CPU > 70'" 
                        className="alert-rule-name-input-box"
                    />

                    <div className="text-before-input-box">
                        Description
                    </div>
                    <textarea placeholder="Specify alert description here..." />

                    <div className="text-before-input-box">
                        Email recipients
                    </div>
                    <input 
                        type="text"
                        placeholder="Seperate email addresses by ;" 
                        className="alert-rule-name-input-box"
                    />

                    <Row className="submit-button-row">
                        <Button 
                            type="submit" 
                            flat 
                            className="submit-button" 
                            iconEl={<FontIcon>{'add_alert'}</FontIcon>}
                        >
                            Create alert rule
                        </Button>
                    </Row>
                </Grid>

                {/* The drawers being used in this screen */}
                <Drawer 
                    onVisibilityChange={this.changeAzureResourcesDrawerVisibility} 
                    visible={this.state.showResourcesDrawer}
                >
                    <AzureResourcesViewer  />
                </Drawer>

                <Drawer 
                    onVisibilityChange={this.changeSignalListDrawerVisibility} 
                    visible={this.state.showSignalsDrawer}
                >
                    <SignalsList signals={[]} />
                </Drawer>
            </div>
        );
    }

    private showAzureResourcesDrawer = () => {
        this.changeAzureResourcesDrawerVisibility(true);
    }

    private changeAzureResourcesDrawerVisibility = (visible: boolean) => {
        this.setState({ showResourcesDrawer: visible });
    }

    private showSignalsListDrawer = () => {
        this.changeSignalListDrawerVisibility(true);
    }

    private changeSignalListDrawerVisibility = (visible: boolean) => {
        this.setState({ showSignalsDrawer: visible });
    }
}