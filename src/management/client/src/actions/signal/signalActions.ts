// -----------------------------------------------------------------------
// <copyright file="signalActions.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Dispatch } from 'redux';

import keys from '../actionTypeKeys';
import {
    GetSignalFailAction,
    GetSignalInProgressAction,
    GetSignalSuccessAction
} from './get';
import Signal from '../../models/Signal';
import StoreState from '../../store/StoreState';
import { getSignalsAsync } from '../../api/signalApi';

/**
 * Create an action for getting the signals
 */
export function getSignals(): (dispatch: Dispatch<StoreState>) => Promise<void> {
    return async (dispatch: Dispatch<StoreState>) => {
        // Notify get signals results work has started
        dispatch(getSignalInProgressAction());

        try {
            const response = await getSignalsAsync();
            
            dispatch(getSignalSuccessAction(response.signals));
          } catch (error) {
            dispatch(getSignalFailAction(error));
          }
    };
}

/**
 * Create an action once getting signals is in progress
 */
function getSignalInProgressAction(): GetSignalInProgressAction {
    return {
        type: keys.GET_SIGNAL_INPROGRESS
    };
}

/**
 * Create an action once getting signals finished successfuly
 * @param signalsResults the retrieved signals results
 */
function getSignalSuccessAction(signals: Signal[]): GetSignalSuccessAction {
    return {
        type: keys.GET_SIGNAL_SUCCESS,
        payload: {
            results: signals
        }
    };
}

/**
 * Create an action once getting signals finished with error
 * @param error The error information
 */
function getSignalFailAction(error: Error): GetSignalFailAction {
    return {
        type: keys.GET_SIGNAL_FAIL,
        payload: {
            error: error
        }
    };
}