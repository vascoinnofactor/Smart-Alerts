// -----------------------------------------------------------------------
// <copyright file="authenticationActions.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Dispatch } from 'redux';

import keys from '../actionTypeKeys';
import StoreState from '../../store/StoreState';
import {
    LoginSuccessAction
} from './index';
import User from '../../models/User';

/**
 * Create an action for login successed
 */
export function loginSuccessed(userDetails: User): (dispatch: Dispatch<StoreState>) => void {
    return (dispatch: Dispatch<StoreState>) => {
            dispatch(getLoginSuccessAction(userDetails));
    };
}

/**
 * Create an action once getting the login finished successfuly
 */
function getLoginSuccessAction(userDetails: User): LoginSuccessAction {
    return {
        type: keys.LOGIN_SUCCESS,
        payload: {
            userDetails: userDetails
        }
    };
}