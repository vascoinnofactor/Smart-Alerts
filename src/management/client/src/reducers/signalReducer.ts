// -----------------------------------------------------------------------
// <copyright file="signalReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ActionTypeKeys from '../actions/actionTypeKeys';
import initialState from './initialState';
import ActionTypes from '../actions/actionTypes';
import { SignalsStoreState } from '../store/StoreState';
import { GetSignalSuccessAction } from '../actions/signal/get';

/**
 * This reducer responsible for the Signals state in the store
 */
export default function signalsReducer(
    state: SignalsStoreState = initialState.signals,
    action: ActionTypes
): SignalsStoreState  {
    switch (action.type) {
        case ActionTypeKeys.GET_SIGNAL_INPROGRESS:
            return onGetSignalInProgress(state);
        case ActionTypeKeys.GET_SIGNAL_SUCCESS:
            return onGetSignalSuccess(action, state);
        case ActionTypeKeys.GET_SIGNAL_FAIL:
            return onGetSignalFail(state);
        default:
            return state;
    }
}

/**
 * Modify the store state once getting signals is in progress
 * @param currentState The store current state
 */
function onGetSignalInProgress(currentState: SignalsStoreState): SignalsStoreState {
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
function onGetSignalSuccess(action: GetSignalSuccessAction, currentState: SignalsStoreState)
    : SignalsStoreState {
    return {
        ...currentState,
        items: action.payload.results,
        isFetching: false,
        lastUpdated: null
    };
}

/**
 * Modify the store state once failed getting signals 
 * @param currentState The store current state
 */
function onGetSignalFail(currentState: SignalsStoreState)
    : SignalsStoreState {
    return {
        ...currentState,
        isFetching: false
    };
}