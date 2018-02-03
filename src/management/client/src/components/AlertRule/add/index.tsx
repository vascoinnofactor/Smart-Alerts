// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';
import Chip from 'react-md/lib/Chips';

import Drawer from '../../Drawer';
import AzureResourcesViewer from '../../AzureResourcesViewer';
import AzureResource from '../../../models/AzureResource';
import Signal from '../../../models/Signal';
import { ResourceType } from '../../../enums/ResourceType';
import SignalsListDrawerView from '../../Signals/SignalsManagement/signalsListDrawerView';

import './indexStyle.css';

interface AddAlertRuleState {
    showResourcesDrawer: boolean;
    showSignalsDrawer: boolean;
    selectedResource?: AzureResource;
    selectedSignal?: Signal;
}

export default class AddAlertRule extends React.Component<{}, AddAlertRuleState> {
    constructor() {
        super({});

        this.state = {
            showResourcesDrawer: false,
            showSignalsDrawer: true,
            selectedResource: undefined,
            selectedSignal: undefined
        };
    }

    public render() {
        let signals: Signal[] = new Array();
        signals.push({ id: 'firstSignal',
                       name: 'Application Insights Signal',
                       supportedResourceTypes: [ResourceType.ApplicationInsights], 
                       supportedCadences: [30, 60], 
                       configurations: []});
        signals.push({ id: 'secondSignal',
                       name: 'Log Analytics Signal',
                       supportedResourceTypes: [ResourceType.LogAnalytics], 
                       supportedCadences: [30, 60], 
                       configurations: []});
        signals.push({ id: 'thirdSignal',
                       name: 'Virtual Machine Signal',
                       supportedResourceTypes: [ResourceType.VirtualMachine], 
                       supportedCadences: [30, 60], 
                       configurations: []});
        signals.push({ id: 'fourthSignal',
                       name: 'Virtual Machine Scale Set Signal',
                       supportedResourceTypes: [ResourceType.VirtualMachineScaleSet], 
                       supportedCadences: [30, 60], 
                       configurations: []});
        signals.push({ id: 'fifthSignal',
                       name: 'Log Analytics Signal #2',
                       supportedResourceTypes: [ResourceType.LogAnalytics, ResourceType.ApplicationInsights], 
                       supportedCadences: [30, 60], 
                       configurations: []});

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
                    {
                        !this.state.selectedResource &&
                        <div className="no-signal-choosed">
                            No resource choosed, click on 'Select resource' to select a resource
                        </div>
                    }
                    {
                        this.state.selectedResource &&
                        this.getResourceChipElement(this.state.selectedResource)
                    }
                    <div className="select-resource-text-button">
                        <a href="#" onClick={this.showAzureResourcesDrawer}>Select resource</a>
                    </div>

                    <div className="text-before-input-box target-signal-header">
                        * Target signal
                    </div>
                    {
                        !this.state.selectedSignal &&
                        <div className="no-signal-choosed">
                            No signal choosed, click on 'Choose signal' to select a signal
                        </div>
                    }
                    {
                        this.state.selectedSignal &&
                        this.getSignalChipElement(this.state.selectedSignal)
                    }
                    <div className="select-resource-text-button">
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
                    <AzureResourcesViewer onDoneButtonPressed={this.onSelectResourceCompleted}  />
                </Drawer>

                <Drawer 
                    onVisibilityChange={this.changeSignalListDrawerVisibility} 
                    visible={this.state.showSignalsDrawer}
                >
                    <SignalsListDrawerView signals={signals} onDoneButtonPressed={this.onSelectSignalCompleted} />
                </Drawer>
            </div>
        );
    }

    private onSelectResourceCompleted = (resource: AzureResource) => {
        this.setState({ selectedResource: resource, showResourcesDrawer: false });
    }

    private onSelectSignalCompleted = (signal: Signal) => {
        this.setState({ selectedSignal: signal, showSignalsDrawer: false });
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

    private getResourceChipElement(resource: AzureResource): JSX.Element {
        let label: string = resource.subscriptionName;

        if (resource.resourceGroup) {
            label += ' - ' + resource.resourceGroup;
        }

        if (resource.resourceName) {
            label += ' - ' + resource.resourceName;
        }

        return (
            <Chip label={label} />
        );
    }

    private getSignalChipElement(signal: Signal): JSX.Element {
        return (
            <Chip label={signal.name} />
        );
    }
}