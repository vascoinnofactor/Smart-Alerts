// -----------------------------------------------------------------------
// <copyright file="signalResultReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ActionTypeKeys from '../actions/actionTypeKeys';
import initialState from './initialState';
import ActionTypes from '../actions/actionTypes';
import { SignalsResultsStoreState } from '../store/StoreState';
import { GetSignalResultSuccessAction } from '../actions/signalResult/get';

/**
 * This reducer responsible for the Signals Results state in the store
 */
export default function signalResultReducer(
    state: SignalsResultsStoreState = initialState.signalsResults,
    action: ActionTypes
): SignalsResultsStoreState  {
    switch (action.type) {
        case ActionTypeKeys.GET_SIGNAL_RESULT_INPROGRESS:
            return onGetSignalResultInProgress(state);
        case ActionTypeKeys.GET_SIGNAL_RESULT_SUCCESS:
            return onGetSignalResultSuccess(action, state);
        case ActionTypeKeys.GET_SIGNAL_RESULT_FAIL:
            return onGetSignalResultFail(state);
        default:
            return state;
    }
}

/**
 * Modify the store state once getting signals results is in progress
 * @param currentState The store current state
 */
function onGetSignalResultInProgress(currentState: SignalsResultsStoreState)
    : SignalsResultsStoreState {
    return {
        ...currentState,
        isFetching: true
    };
}

/**
 * Modify the store state once getting signals results was completed successfuly
 * @param action The action that represents getting signals results successfuly  
 * @param currentState The store current state
 */
function onGetSignalResultSuccess(action: GetSignalResultSuccessAction,
                                  currentState: SignalsResultsStoreState)
    : SignalsResultsStoreState {
    return {
        ...currentState,
        items: {...action.payload.results},
        isFetching: false,
        lastUpdated: null
    };
}

/**
 * Modify the store state once failed getting signals results
 * @param currentState The store current state
 */
function onGetSignalResultFail(currentState: SignalsResultsStoreState)
    : SignalsResultsStoreState {
    return {
        ...currentState,
        isFetching: false
    };
}