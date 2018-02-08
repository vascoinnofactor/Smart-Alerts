// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import keys from '../../actionTypeKeys';
import AzureSubscriptionResources from '../../../models/AzureSubscriptionResources';

/**
 * Represents an action for getting the resources.
 */
export interface GetResourceInProgressAction {
    readonly type: keys.GET_RESOURCE_INPROGRESS;
}

/**
 * Represents an action once the resources retrieved successfuly.
 */
export interface GetResourceSuccessAction {
    readonly type: keys.GET_RESOURCE_SUCCESS;
    readonly payload: {
        readonly results: ReadonlyArray<AzureSubscriptionResources>;
    };
}

/**
 * Represents an action once there was a failure while getting the resources.
 */
export interface GetResourceFailAction {
    readonly type: keys.GET_RESOURCE_FAIL;
    readonly payload: {
        readonly error: Error;
    };
}