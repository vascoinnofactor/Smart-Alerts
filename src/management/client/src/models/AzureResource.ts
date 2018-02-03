// -----------------------------------------------------------------------
// <copyright file="AzureResource.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ResourceType from '../enums/ResourceType';

/**
 * This model represent an Azure resource
 * The minimal required property is the subscription id 
 */
export default interface AzureResource {
    /**
     * The Azure subscription id
     */
    subscriptionId: string;

    /**
     * The Azure subscription name
     */
    subscriptionName: string;

    /**
     * The Azure resource type
     */
    resourceType: ResourceType;

    /**
     * The Azure resource group
     */
    resourceGroup?: string;

    /**
     * The Azure resource name
     */
    resourceName?: string;
}