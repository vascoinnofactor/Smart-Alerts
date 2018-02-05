// -----------------------------------------------------------------------
// <copyright file="SelectedAzureResource.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ResourceType from '../../enums/ResourceType';

export default interface SelectedAzureResource {
    subscriptionId: string;

    subscriptionName: string;

    resourceType: ResourceType;

    resourceGroup?: string;

    resourceName?: string;

    resourceId: string;
}