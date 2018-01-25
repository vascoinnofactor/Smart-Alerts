// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import keys from '../actionTypeKeys';
import User from '../../models/User';

/**
 * Represents an action login was successful.
 */
export interface LoginSuccessAction {
    readonly type: keys.LOGIN_SUCCESS;
    readonly payload: {
        readonly userDetails: User
    };
}