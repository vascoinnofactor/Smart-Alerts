// -----------------------------------------------------------------------
// <copyright file="resourceActions.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Dispatch } from 'redux';

import keys from '../actionTypeKeys';
import {
    GetResourceInProgressAction,
    GetResourceSuccessAction,
    GetResourceFailAction
} from './get';
import StoreState from '../../store/StoreState';
import { getResourcesAsync } from '../../api/resourceApi';
import AzureSubscriptionResources from '../../models/AzureSubscriptionResources';

/**
 * Create an action for getting the available Azure resources
 */
export function getAzureResources(): (dispatch: Dispatch<StoreState>) => Promise<void> {
    return async (dispatch: Dispatch<StoreState>) => {
        dispatch(getResourceInProgressAction());

        try {
            const response = await getResourcesAsync();
            
            dispatch(getResourceSuccessAction(response.subscriptionResources));
          } catch (error) {
            dispatch(getResourceFailAction(error));
          }
    };
}

/**
 * Create an action once getting subscriptions is in progress
 */
function getResourceInProgressAction(): GetResourceInProgressAction {
    return {
        type: keys.GET_RESOURCE_INPROGRESS
    };
}

/**
 * Create an action once getting resources finished successfuly
 * @param resources The retrieved resources
 */
function getResourceSuccessAction(resources: ReadonlyArray<AzureSubscriptionResources>)
            : GetResourceSuccessAction {
    return {
        type: keys.GET_RESOURCE_SUCCESS,
        payload: {
            results: resources
        }
    };
}

/**
 * Create an action once getting resources finished with error
 * @param error The error information
 */
function getResourceFailAction(error: Error): GetResourceFailAction {
    return {
        type: keys.GET_RESOURCE_FAIL,
        payload: {
            error: error
        }
    };
}