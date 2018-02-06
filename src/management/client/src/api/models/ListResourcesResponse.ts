// -----------------------------------------------------------------------
// <copyright file="ListResourcesResponse.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import AzureSubscriptionResources from '../../models/AzureSubscriptionResources';

/**
 * Represents the response model for the GET /resource endpoint
 */
export default class ListResourcesResponse {
    /**
     * Gets or list of Azure resources
     */
    public subscriptionResources: ReadonlyArray<AzureSubscriptionResources>;
}