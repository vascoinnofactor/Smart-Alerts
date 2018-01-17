// -----------------------------------------------------------------------
// <copyright file="queryResultReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as moment from 'moment';

import ActionTypeKeys from '../actions/actionTypeKeys';
import initialState from './initialState';
import ActionTypes from '../actions/actionTypes';
import { QueryResultStoreState } from '../store/StoreState';
import { GetQueryResultInProgressAction, GetQueryResultSuccessAction,
         GetQueryResultFailAction } from '../actions/queryResult/get';

/**
 * This reducer responsible for the query results state in the store
 */
export default function signalsReducer(
    state: Map<string, QueryResultStoreState> = initialState.queryResults,
    action: ActionTypes
): Map<string, QueryResultStoreState>  {
    switch (action.type) {
        case ActionTypeKeys.GET_QUERY_RESULT_INPROGRESS:
            return onGetQueryResultInProgress(action, state);
        case ActionTypeKeys.GET_QUERY_RESULT_SUCCESS:
            return onGetQueryResultSuccess(action, state);
        case ActionTypeKeys.GET_QUERY_RESULT_FAIL:
            return onGetQueryResultFail(action, state);
        default:
            return state;
    }
}

/**
 * Modify the store state once getting query result is in progress
 * @param currentState The store current state
 */
function onGetQueryResultInProgress(action: GetQueryResultInProgressAction,
                                    currentState: Map<string, QueryResultStoreState>)
        : Map<string, QueryResultStoreState> {
    let newState = {...currentState};
    newState[action.payload.queryId].isFetching = true;

    return newState;
}

/**
 * Modify the store state once getting query result was completed successfuly
 * @param action The get signal success action
 * @param currentState The store current state
 */
function onGetQueryResultSuccess(action: GetQueryResultSuccessAction, currentState: Map<string, QueryResultStoreState>)
        : Map<string, QueryResultStoreState> {
    let newState = {...currentState};
    newState[action.payload.queryId].isFetching = false;
    newState[action.payload.queryId].result = action.payload.result;
    newState[action.payload.queryId].lastUpdated = moment.utc();

    return newState;
}

/**
 * Modify the store state once failed getting query result 
 * @param currentState The store current state
 */
function onGetQueryResultFail(action: GetQueryResultFailAction, currentState: Map<string, QueryResultStoreState>)
        : Map<string, QueryResultStoreState> {
    let newState = {...currentState};
    newState[action.payload.queryId].isFetching = false;
    newState[action.payload.queryId].lastUpdated = null;

    return newState;
}