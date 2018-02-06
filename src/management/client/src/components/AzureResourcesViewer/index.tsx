// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import Select, { Option } from 'react-select';
import Button from 'react-md/lib/Buttons';
import * as _ from 'lodash';

import AzureResource from '../../models/AzureResource';
import { ResourceType } from '../../enums/ResourceType';
import SelectedAzureResource from './selectedAzureResource';
import AzureSubscriptionResources from '../../models/AzureSubscriptionResources';
import { GetAzureResourceId } from '../../utils/AzureResourceUtils';

import './indexStyle.css';

interface AzureResourcesViewerProps {
    azureSubscriptionsResources: ReadonlyArray<AzureSubscriptionResources>;
    onDoneButtonPressed: (selectedReosurce: SelectedAzureResource) => void;
}

interface AzureResourceViewerState {
    selectedSubscriptionId?: string;
    selectedSubscriptionName?: string;
    selectedResourceType?: string;
    selectedResourceGroup?: string;
    selectedResourceName?: string;
    selectedResourceId?: string;
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
            selectedSubscriptionName: undefined,
            selectedResourceType: undefined,
            selectedResourceGroup: undefined,
            selectedResourceName: undefined
        };
    }

    public render() {
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
                     id="yayayaya"
                     name="yayaya"
                     options={this.getAzureSubscriptionsOptions()}
                     searchable
                     className="select-box"
                     onChange={this.onSubscriptionSelectBoxValueChanged}
                     value={this.state.selectedSubscriptionId ? 
                                this.state.selectedSubscriptionId : 
                                'N/A'}
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
                                options={this.getAzureResourceGroupsNamesOptions()}
                                searchable
                                className="select-box"
                                onChange={this.onReosurceGroupSelecteBoxValueChanged}
                                value={this.state.selectedResourceGroup ? 
                                            this.state.selectedResourceGroup : 
                                            this.chooseAllOption}
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
                            options={this.getAzureResourcesOptions()}
                            searchable
                            className="select-box"
                            onChange={this.onReosurceNameSelecteBoxValueChanged}
                            value={this.state.selectedResourceName ? 
                                        this.state.selectedResourceName : 
                                        this.chooseAllOption}
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

    private getAzureSubscriptionsOptions(): Array<Option<string>> {
        let subscriptionsOptions = new Array<Option<string>>();

        this.props.azureSubscriptionsResources.forEach((subscriptionResources) => {
            subscriptionsOptions.push({ 
                label: subscriptionResources.subscription.displayName,
                value: subscriptionResources.subscription.id
            });
        });

        return subscriptionsOptions;
    }

    /**
     * Get all the Azure resources options available by the choosed subscriotion 
     * and reosurce group. 
     */
    private getAzureResourcesOptions(): Array<Option<string>> {
        if (!this.state.selectedResourceGroup || !this.state.selectedSubscriptionId) {
            return [this.chooseAllOption];
        }

        // Make sure selected resource type is not subscription/resource group
        if (!this.state.selectedResourceType ||
            this.state.selectedResourceType === 'Subscription' ||
            this.state.selectedResourceType === 'ResourceGroup') {
                throw new Error('Cant create resources options when select resource ' +
                                'type is Subscription or Resource Group');
        }
        
        // Find the resources by the choosen subscription id
        let allResourcesOfSelectedSubscription: ReadonlyArray<AzureResource>;
        allResourcesOfSelectedSubscription = this.props.azureSubscriptionsResources.filter(subscriptionResources => 
                            subscriptionResources.subscription.id === this.state.selectedSubscriptionId)[0].resources;

        // Filter all the resources by the choosen resource type
        let filteredResources: AzureResource[] = allResourcesOfSelectedSubscription.filter(resource =>
                                                resource.resourceGroupName === this.state.selectedResourceGroup &&
                                                resource.resourceType.toString() === this.state.selectedResourceType);

        let resourcesOptions: Array<Option<string>> = new Array();
        filteredResources.forEach(resource => resourcesOptions.push({
            label: resource.resourceName,
            value: resource.resourceName
        }));

        return resourcesOptions;
    }

    /**
     * Get all the Azure resource groups names by the choosen subscription.
     */
    private getAzureResourceGroupsNamesOptions(): Array<Option<string>> {
        // Make sure selected resource type is not subscription
        if (!this.state.selectedResourceType ||
            this.state.selectedResourceType === 'Subscription') {
                throw new Error('Cant create reosurce groups names options when select resource ' +
                                'type is Subscription');
        }
        
        // Find the resources by the choosen subscription id
        let allResourcesOfSelectedSubscription: ReadonlyArray<AzureResource>;
        allResourcesOfSelectedSubscription = this.props.azureSubscriptionsResources.filter(subscriptionResources => 
                            subscriptionResources.subscription.id === this.state.selectedSubscriptionId)[0].resources;

        // Get the distinct values of the resource groups names
        let resourceGroupsNames = allResourcesOfSelectedSubscription
                                    .filter(resource => resource.resourceGroupName !== undefined)
                                    .map(resource => resource.resourceGroupName);

        let uniqueResourceGroupsNames = _.uniq(resourceGroupsNames);

        let resourcegroupsNamesOptions: Array<Option<string>> = new Array();
        uniqueResourceGroupsNames.forEach(resourceGroup => resourcegroupsNamesOptions.push({
            label: resourceGroup,
            value: resourceGroup
        }));

        return resourcegroupsNamesOptions;
    }

    private onSubscriptionSelectBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedSubscriptionId: option ? option.value : undefined, 
                        selectedSubscriptionName: option ? option.label : undefined });
    }

    private onReosurceTypeSelecteBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedResourceType: option ? option.value : undefined });
    }

    private onReosurceGroupSelecteBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedResourceGroup: option ? option.value : undefined });
    }

    private onReosurceNameSelecteBoxValueChanged(option: Option<string>): void {
        this.setState({ selectedResourceName: option ? option.value : undefined });
    }

    private onDoneButtonPressed(): void {
        if (!this.state.selectedSubscriptionId || !this.state.selectedSubscriptionName) {
            throw new Error('Subscription id/name cant be undefined');
        }

        if (!this.state.selectedResourceType) {
            throw new Error('Resource type cant be undefined');
        }

        let selectedResourceType = ResourceType[this.state.selectedResourceType];
        let azureResource: SelectedAzureResource = {
            subscriptionId: this.state.selectedSubscriptionId,
            subscriptionName: this.state.selectedSubscriptionName,
            resourceType: ResourceType[this.state.selectedResourceType],
            resourceGroup: selectedResourceType === ResourceType.Subscription ? 
                                undefined : 
                                this.state.selectedResourceGroup,
            resourceName: selectedResourceType === ResourceType.Subscription ||
                          selectedResourceType === ResourceType.ResourceGroup ? 
                                undefined : 
                                this.state.selectedResourceName,
            resourceId: GetAzureResourceId(selectedResourceType, this.state.selectedSubscriptionId,
                                           this.state.selectedResourceGroup, this.state.selectedResourceName)
        };

        this.props.onDoneButtonPressed(azureResource);
    }
}