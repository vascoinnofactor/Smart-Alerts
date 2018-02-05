// -----------------------------------------------------------------------
// <copyright file="AzureSubscriptionResources.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import AzureSubscription from './AzureSubscription';
import AzureResource from './AzureResource';

export default interface AzureSubscriptionResources {
    /**
     * The Azure subscription.
     */
    subscription: AzureSubscription;

    /**
     * The Azure subscription resources.
     */
    resources: ReadonlyArray<AzureResource>;
}