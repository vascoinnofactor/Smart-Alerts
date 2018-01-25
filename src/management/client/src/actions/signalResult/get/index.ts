// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import keys from '../../actionTypeKeys';
import SignalResult from '../../../models/SignalResult';

/**
 * Represents an action for getting the signal results.
 */
export interface GetSignalResultInProgressAction {
    readonly type: keys.GET_SIGNAL_RESULT_INPROGRESS;
}

/**
 * Represents an action once the signal results retrieved successfuly.
 */
export interface GetSignalResultSuccessAction {
    readonly type: keys.GET_SIGNAL_RESULT_SUCCESS;
    readonly payload: {
        readonly results: ReadonlyArray<SignalResult>;
    };
}

/**
 * Represents an action once there was a failure while getting the signal results.
 */
export interface GetSignalResultFailAction {
    readonly type: keys.GET_SIGNAL_RESULT_FAIL;
    readonly payload: {
        readonly error: Error;
    };
}