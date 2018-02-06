// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-flexbox-grid';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';
import Chip from 'react-md/lib/Chips';
import { bindActionCreators, Dispatch } from 'redux';

import Drawer from '../../Drawer';
import AzureResourcesViewer from '../../AzureResourcesViewer';
import SelectedAzureResource from '../../AzureResourcesViewer/selectedAzureResource';
import Signal from '../../../models/Signal';
import SignalsListDrawerView from '../../Signals/SignalsManagement/signalsListDrawerView';
import StoreState from '../../../store/StoreState';
import { getAzureResources } from '../../../actions/resource/resourceActions';
import { getSignals } from '../../../actions/signal/signalActions';
import { addAlertRule } from '../../../actions/alertRule/alertRuleActions';
import AzureSubscriptionResources from '../../../models/AzureSubscriptionResources';
import AlertRule from '../../../models/AlertRule';
import FormatUtils from '../../../utils/FormatUtils';

import './indexStyle.css';

/**
 * Represents the AddAlertRule component props for the dispatch functions
 */
interface AddAlertRuleDispatchProps {
    getSignals: () => (dispatch: Dispatch<StoreState>) => Promise<void>;
    getAzureResources: () => (dispatch: Dispatch<StoreState>) => Promise<void>;
    addAlertRule: (alertRule: AlertRule) => (dispatch: Dispatch<StoreState>) => Promise<void>;
}

/**
 * Represents the AddAlertRule component props for the component inner state  
 */
interface AddAlertRuleStateProps {
    signals: ReadonlyArray<Signal>;
    azureResources: ReadonlyArray<AzureSubscriptionResources>;
}

/**
 * Represents the AddAlertRule component state
 */
interface AddAlertRuleState {
    showResourcesDrawer: boolean;
    showSignalsDrawer: boolean;
    selectedResource?: SelectedAzureResource;
    selectedSignal?: Signal;
    selectedAlertRuleName?: string;
    selectedAlertRuleDescription?: string;
    selectedAlertRuleEmailRecipients?: string;
}

// Create a type combined from all the props
type AddAlertRuleProps = AddAlertRuleDispatchProps &
                         AddAlertRuleStateProps;

class AddAlertRule extends React.Component<AddAlertRuleProps, AddAlertRuleState> {
    constructor(props: AddAlertRuleProps) {
        super(props);

        this.onSubmitButtonPressed = this.onSubmitButtonPressed.bind(this);
        
        this.state = {
            showResourcesDrawer: false,
            showSignalsDrawer: true,
            selectedResource: undefined,
            selectedSignal: undefined,
            selectedAlertRuleName: undefined,
            selectedAlertRuleDescription: undefined,
            selectedAlertRuleEmailRecipients: undefined
        };
    }

    public async componentDidMount() {
        await this.props.getAzureResources();
        await this.props.getSignals();
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

                    <div className="text-before-input-box run-every-header">
                        Run interval
                    </div>
                    <select disabled={this.state.selectedSignal === undefined}>
                        {
                            this.state.selectedSignal &&
                            this.getSignalRunEveryIntervalsOptions(this.state.selectedSignal.supportedCadences)
                        }
                        {
                            !this.state.selectedSignal &&
                            <option value="noSignalSelectd">Please select signal first</option>
                        }
                    </select>

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
                        onChange={this.onChangeAlertRuleName}
                    />

                    <div className="text-before-input-box">
                        Description
                    </div>
                    <textarea 
                        placeholder="Specify alert description here..." 
                        onChange={this.onChangeAlertRuleDescription}
                    />

                    <div className="text-before-input-box">
                        Email recipients
                    </div>
                    <input 
                        type="text"
                        placeholder="Seperate email addresses by ;" 
                        className="alert-rule-name-input-box"
                        onChange={this.onChangeAlertRuleEmailRecipients}
                    />

                    <Row className="submit-button-row">
                        <Button 
                            type="submit" 
                            flat 
                            className="submit-button" 
                            iconEl={<FontIcon>{'add_alert'}</FontIcon>}
                            onClick={this.onSubmitButtonPressed}
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
                    <AzureResourcesViewer
                        onDoneButtonPressed={this.onSelectResourceCompleted} 
                        azureSubscriptionsResources={this.props.azureResources} 
                    />
                </Drawer>

                <Drawer 
                    onVisibilityChange={this.changeSignalListDrawerVisibility} 
                    visible={this.state.showSignalsDrawer}
                >
                    <SignalsListDrawerView 
                        signals={this.props.signals} 
                        onDoneButtonPressed={this.onSelectSignalCompleted} 
                    />
                </Drawer>
            </div>
        );
    }

    private onSelectResourceCompleted = (selectedResource: SelectedAzureResource) => {
        this.setState({ selectedResource: selectedResource, showResourcesDrawer: false });
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

    private onChangeAlertRuleName = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ selectedAlertRuleName: e.currentTarget.value });
    }

    private onChangeAlertRuleDescription = (e: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({ selectedAlertRuleDescription: e.currentTarget.value });
    }

    private onChangeAlertRuleEmailRecipients = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ selectedAlertRuleEmailRecipients: e.currentTarget.value });
    }

    private getResourceChipElement(resource: SelectedAzureResource): JSX.Element {
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

    private getSignalRunEveryIntervalsOptions(cadencesIntervalInMinutes: number[]): JSX.Element[] {
        return cadencesIntervalInMinutes.map(interval => 
            (<option value="interval">{FormatUtils.minutesToStringPresentation(interval)}</option>));
    }

    private async onSubmitButtonPressed() {
        if (!this.state.selectedResource) {
            throw new Error('Cant add alert rule when selected no resource was selected');
        }

        if (!this.state.selectedSignal) {
            throw new Error('Cant add alert rule when selected no signal was selected');
        }

        if (!this.state.selectedAlertRuleName) {
            throw new Error('Cant add alert rule when no alert rule name was mentioned');
        }

        // Create the alert rule based on the user input
        let alertRule: AlertRule = {
            resourceId: this.state.selectedResource.resourceId,
            signalId: this.state.selectedSignal.id,
            name: this.state.selectedAlertRuleName,
            description: this.state.selectedAlertRuleDescription,
            emailRecipients: this.state.selectedAlertRuleEmailRecipients ?
                                this.state.selectedAlertRuleEmailRecipients.split(';') :
                                undefined,
            schedule: ''
        };

        await this.props.addAlertRule(alertRule);
    }
}

/**
 * Map between the given state to this component props.
 * @param state The current state
 */
function mapStateToProps(state: StoreState): AddAlertRuleStateProps {
    return {
        azureResources: state.resources.resources,
        signals: state.signals.items
    };
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<StoreState>): AddAlertRuleDispatchProps {
    return {
        getAzureResources: bindActionCreators(getAzureResources, dispatch),
        getSignals: bindActionCreators(getSignals, dispatch),
        addAlertRule: bindActionCreators(addAlertRule, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAlertRule);