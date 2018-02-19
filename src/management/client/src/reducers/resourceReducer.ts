// -----------------------------------------------------------------------
// <copyright file="resourceReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ActionTypeKeys from '../actions/actionTypeKeys';
import initialState from './initialState';
import ActionTypes from '../actions/actionTypes';
import { ResourcesStoreState } from '../store/StoreState';
import { GetResourceSuccessAction } from '../actions/resource/get';

/**
 * This reducer responsible for the resources state in the store
 */
export default function resourceReducer(
    state: ResourcesStoreState = initialState.resources,
    action: ActionTypes
): ResourcesStoreState {
    switch (action.type) {
        case ActionTypeKeys.GET_RESOURCE_INPROGRESS:
            return onGetResourceInProgress(state);
        case ActionTypeKeys.GET_RESOURCE_SUCCESS:
            return onGetResourceSuccess(action, state);
        case ActionTypeKeys.GET_RESOURCE_FAIL:
            return onGetResourceFail(state);
        default:
            return state;
    }
}

/**
 * Modify the store state once getting Azure resources is in progress
 * @param currentState The store current state
 */
function onGetResourceInProgress(currentState: ResourcesStoreState): ResourcesStoreState {

    return {
        ...currentState,
        isFetching: true
    };
}

/**
 * Modify the store state once getting signals was completed successfuly
 * @param action The get signal success action
 * @param currentState The store current state
 */
function onGetResourceSuccess(action: GetResourceSuccessAction, currentState: ResourcesStoreState)
    : ResourcesStoreState {
    return {
        ...currentState,
        azureSubscriptionsResources: action.payload.results,
        isFetching: false
    };
}

/**
 * Modify the store state once failed getting signals 
 * @param currentState The store current state
 */
function onGetResourceFail(currentState: ResourcesStoreState)
    : ResourcesStoreState {
    return {
        ...currentState,
        isFetching: false
    };
}