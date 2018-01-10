// -----------------------------------------------------------------------
// <copyright file="signalResultActions.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Dispatch } from 'redux';

import keys from '../actionTypeKeys';
import {
    GetSignalResultInProgressAction,
    GetSignalResultSuccessAction, 
    GetSignalResultFailAction
} from './get';
import SignalResult from '../../models/SignalResult';
import StoreState from '../../store/StoreState';
import { GetSignalsResults } from '../../api/signalResultApi';

/**
 * Create an action for getting the signals results
 */
export function getSignalsResults(): (dispatch: Dispatch<StoreState>) => Promise<void> {
    return async (dispatch: Dispatch<StoreState>) => {
        // Notify get signals results work has started
        dispatch(getSignalResultInProgressAction());

        try {
            const signalsResults = await GetSignalsResults();
            
            dispatch(getSignalResultSuccessAction(signalsResults));
          } catch (error) {
            dispatch(getSignalResultFailAction(error));
          }
    };
}

/**
 * Create an action once getting signals results is in progress
 */
function getSignalResultInProgressAction(): GetSignalResultInProgressAction {
    return {
        type: keys.GET_SIGNAL_RESULT_INPROGRESS
    };
}

/**
 * Create an action once getting signals results finished successfuly
 * @param signalsResults the retrieved signals results
 */
function getSignalResultSuccessAction(signalsResults: SignalResult[]): GetSignalResultSuccessAction {
    return {
        type: keys.GET_SIGNAL_RESULT_SUCCESS,
        payload: {
            results: signalsResults
        }
    };
}

/**
 * Create an action once getting signals results finished with error
 * @param error The error information
 */
function getSignalResultFailAction(error: Error): GetSignalResultFailAction {
    return {
        type: keys.GET_SIGNAL_RESULT_FAIL,
        payload: {
            error: error
        }
    };
}