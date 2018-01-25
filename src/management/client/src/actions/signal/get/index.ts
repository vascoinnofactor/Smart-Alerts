// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import keys from '../../actionTypeKeys';
import Signal from '../../../models/Signal';

/**
 * Represents an action for getting the signals.
 */
export interface GetSignalInProgressAction {
    readonly type: keys.GET_SIGNAL_INPROGRESS;
}

/**
 * Represents an action once the signals retrieved successfuly.
 */
export interface GetSignalSuccessAction {
    readonly type: keys.GET_SIGNAL_SUCCESS;
    readonly payload: {
        readonly results: ReadonlyArray<Signal>;
    };
}

/**
 * Represents an action once there was a failure while getting the signals.
 */
export interface GetSignalFailAction {
    readonly type: keys.GET_SIGNAL_FAIL;
    readonly payload: {
        readonly error: Error;
    };
}