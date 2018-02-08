// -----------------------------------------------------------------------
// <copyright file="AzureResourceUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ResourceType from '../enums/ResourceType';

let SubscriptionRegexPattern = '/subscriptions/(?<subscriptionId>[^/]*)';
let ResourceGroupRegexPattern = SubscriptionRegexPattern + '/resourceGroups/(?<resourceGroupName>[^/]*)';
let ResourceRegexPattern = ResourceGroupRegexPattern +
                           '/providers/(?<resourceProviderAndType>.*)/(?<resourceName>[^/]*)';

// Set the mapping between resource type to it's Azure resource string
let MapResourceTypeToString = new Map<ResourceType, string>();
MapResourceTypeToString.set(ResourceType.VirtualMachine, 'Microsoft.Compute/virtualMachines');
MapResourceTypeToString.set(ResourceType.VirtualMachineScaleSet, 'Microsoft.Compute/virtualMachineScaleSets');
MapResourceTypeToString.set(ResourceType.ApplicationInsights, 'Microsoft.Insights/components');
MapResourceTypeToString.set(ResourceType.LogAnalytics, 'Microsoft.OperationalInsights/workspaces');

export function GetAzureResourceId(resourceType: ResourceType, subscriptionId: string, 
                                   resourceGroupName?: string, resourceName?: string): string {
    // Find the regex pattern based on the type
    let pattern: string;
    let resourceProviderAndType: string = '';
    switch (resourceType) {
        case ResourceType.Subscription: {
            pattern = SubscriptionRegexPattern;
            break;
        }
        case ResourceType.ResourceGroup: {
            pattern = ResourceGroupRegexPattern;
            break;
        }
        default: {
            pattern = ResourceRegexPattern;
            
            if (!MapResourceTypeToString.has(resourceType)) {
                throw new Error('Given resource type is not supported');
            }

            // We can't cast as we are checking value is exists before
            resourceProviderAndType = MapResourceTypeToString.get(resourceType) as string;
        }
    }

    // Replace the pattern components based on the resource identifier properties
    pattern = pattern.replace('(?<subscriptionId>[^/]*)', subscriptionId);
    if (resourceType !== ResourceType.Subscription && resourceGroupName) {
        pattern = pattern.replace('(?<resourceGroupName>[^/]*)', resourceGroupName);

        if (resourceType !== ResourceType.ResourceGroup && resourceName) {
            pattern = pattern.replace('(?<resourceProviderAndType>.*)', resourceProviderAndType);
            pattern = pattern.replace('(?<resourceName>[^/]*)', resourceName);
        }
    }

    return pattern;
}