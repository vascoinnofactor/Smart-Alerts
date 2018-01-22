// -----------------------------------------------------------------------
// <copyright file="isAuthenticatedReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import initialState from './initialState';
import ActionTypeKeys from '../actions/actionTypeKeys';
import ActionTypes from '../actions/actionTypes';

/**
 * This reducer responsible for the authentication status state in the store
 */
export default function isAuthenticatedReducer(
    state: boolean = initialState.isAuthenticated,
    action: ActionTypes
): boolean {
    switch (action.type) {
        case ActionTypeKeys.LOGIN_SUCCESS:
            return onLoginSuccess();
        default:
            return state;
    }
}

/**
 * Modify the store state once getting login was completed successfuly
 */
function onLoginSuccess(): boolean {
    return true;
}