// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import Select, { Option } from 'react-select';
import Button from 'react-md/lib/Buttons';

import AzureResource from '../../models/AzureResource';

import './indexStyle.css';
import { ResourceType } from '../../enums/ResourceType';

interface AzureResourcesViewerProps {
    onDoneButtonPressed: (resource: AzureResource) => void;
}

interface AzureResourceViewerState {
    selectedSubscriptionId?: string;
    selectedResourceType?: string;
    selectedResourceGroup?: string;
    selectedResourceName?: string;
}

export default class AzureResourcesViewer extends React.Component<AzureResourcesViewerProps, AzureResourceViewerState> {
    /**
     * Represents the default option for resource group and resource select boxes - All
     */
    private chooseAllOption: Option<string> = { label: 'All', value: undefined };

    /**
     * Represents the available resource types
     */
    private availableResourceTypes: Array<Option<string>> = new Array();

    constructor(props: AzureResourcesViewerProps) {
        super(props);

        this.onDoneButtonPressed = this.onDoneButtonPressed.bind(this);
        this.onSubscriptionSelectBoxValueChanged = this.onSubscriptionSelectBoxValueChanged.bind(this);
        this.onReosurceTypeSelecteBoxValueChanged = this.onReosurceTypeSelecteBoxValueChanged.bind(this);
        this.onReosurceGroupSelecteBoxValueChanged = this.onReosurceGroupSelecteBoxValueChanged.bind(this);
        this.onReosurceNameSelecteBoxValueChanged = this.onReosurceNameSelecteBoxValueChanged.bind(this);

        this.availableResourceTypes.push({ label: 'Subscription', value: 'Subscription' });
        this.availableResourceTypes.push({ label: 'Resource Group', value: 'ResourceGroup' });
        this.availableResourceTypes.push({ label: 'Log Analytics', value: 'LogAnalytics' });
        this.availableResourceTypes.push({ label: 'Application Insights', value: 'ApplicationInsights' });
        this.availableResourceTypes.push({ label: 'Virtual Machine', value: 'VirtualMachine' });
        this.availableResourceTypes.push({ label: 'Virtual Machine Scale Set', value: 'VirtualMachineScaleSet' });

        this.state = {
            selectedSubscriptionId: undefined,
            selectedResourceType: undefined,
            selectedResourceGroup: undefined,
            selectedResourceName: undefined
        };
    }

    public render() {
        let options: Array<Option<string>> = new Array();
        options.push({ value: 'first option id', label: 'First Value'});
        options.push({ value: 'second option id', label: 'Second Value'});

        return (
            <div className="azure-resources-viewer">
                <div className="title">
                    Select a resource
                </div>

                <div className="description">
                    Select a resource that will be used to trigger the alerts, specify a subscription and 
                    filter by resource type to refine the resource list.
                </div>
                
                <div className="text-before-select-box">
                    * Filter by subscription
                </div>
                <Select
                     options={options}
                     searchable
                     className="select-box"
                     onChange={this.onSubscriptionSelectBoxValueChanged}
                />

                <div className="text-before-select-box">
                    * Filter by resource type
                </div>
                <Select
                     options={this.availableResourceTypes}
                     searchable
                     className="select-box"
                     onChange={this.onReosurceTypeSelecteBoxValueChanged}
                     value={this.state.selectedResourceType}
                />

                {
                    this.state.selectedResourceType &&
                    this.state.selectedResourceType !== 'Subscription' &&
                    <div>
                        <div className="text-before-select-box">
                            * Filter by resource group
                        </div>
                        <Select
                                options={options}
                                searchable
                                className="select-box"
                                onChange={this.onReosurceGroupSelecteBoxValueChanged}
                                value={this.chooseAllOption}
                        />
                    </div>
                }

                {
                    this.state.selectedResourceType &&
                    this.state.selectedResourceType !== 'Subscription' &&
                    this.state.selectedResourceType !== 'ResourceGroup' &&
                    <div>
                        <div className="text-before-select-box">
                            * Resource
                        </div>
                        <Select
                            options={options}
                            searchable
                            className="select-box"
                            onChange={this.onReosurceNameSelecteBoxValueChanged}
                            value={this.chooseAllOption}
                        />
                    </div>
                }
                <Button 
                    type="submit" 
                    flat 
                    className="submit-button" 
                    onClick={this.onDoneButtonPressed}
                    disabled={this.state.selectedSubscriptionId === undefined}
                >
                    Done
                </Button>
            </div>
        );
    }

    private onSubscriptionSelectBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedSubscriptionId: option.value });
    }

    private onReosurceTypeSelecteBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedResourceType: option.value });
    }

    private onReosurceGroupSelecteBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedResourceGroup: option.value });
    }

    private onReosurceNameSelecteBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedResourceName: option.value });
    }

    // private isInputValid(): boolean {
    //     return true;
    // }

    private onDoneButtonPressed(): void {
        if (!this.state.selectedSubscriptionId) {
            throw new Error('Subscription id cant be undefined');
        }

        if (!this.state.selectedResourceType) {
            throw new Error('Resource type cant be undefined');
        }

        let selectedResourceType = ResourceType[this.state.selectedResourceType];
        let azureResource: AzureResource = {
            subscriptionId: this.state.selectedSubscriptionId,
            subscriptionName: this.state.selectedSubscriptionId,
            resourceType: ResourceType[this.state.selectedResourceType],
            resourceGroup: selectedResourceType === ResourceType.Subscription ? 
                                undefined : 
                                this.state.selectedResourceGroup,
            resourceName: selectedResourceType === ResourceType.Subscription ||
                          selectedResourceType === ResourceType.ResourceGroup ? 
                                undefined : 
                                this.state.selectedResourceName
        };

        this.props.onDoneButtonPressed(azureResource);
    }
}