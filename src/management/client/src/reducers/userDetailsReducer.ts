// -----------------------------------------------------------------------
// <copyright file="userDetailsReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import initialState from './initialState';
import ActionTypeKeys from '../actions/actionTypeKeys';
import ActionTypes from '../actions/actionTypes';
import User from '../models/User';
import { LoginSuccessAction } from '../actions/authentication/index';

/**
 * This reducer responsible for the authenticated user details state in the store
 */
export default function userDetailsReducer(
    state: User | null = initialState.userDetails,
    action: ActionTypes
): User | null {
    switch (action.type) {
        case ActionTypeKeys.LOGIN_SUCCESS:
            return onLoginSuccess(action);
        default:
            return state;
    }
}

/**
 * Modify the store state once getting login was completed successfuly
 */
function onLoginSuccess(action: LoginSuccessAction): User {
    return action.payload.userDetails;
}