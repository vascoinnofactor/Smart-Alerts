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
    // Check if we only need to add new item of query result state
    if (!currentState.has(action.payload.queryId)) {
        currentState.set(action.payload.queryId, {
            isFetching: true,
            lastUpdated: null,
            result: null
        });

        return currentState;
    }

    // As we need to keep the Map immutable - we will remove and add the item
    let newQueryResultState: QueryResultStoreState = {
        isFetching: true,
        result: null,
        lastUpdated: null
    };

    // Replace the result
    currentState.delete(action.payload.queryId);
    currentState.set(action.payload.queryId, newQueryResultState);

    return new Map<string, QueryResultStoreState>(currentState);
}

/**
 * Modify the store state once getting query result was completed successfuly
 * @param action The get signal success action
 * @param currentState The store current state
 */
function onGetQueryResultSuccess(action: GetQueryResultSuccessAction, currentState: Map<string, QueryResultStoreState>)
        : Map<string, QueryResultStoreState> {
    let newQueryResultState: QueryResultStoreState = {
        result: action.payload.result,
        isFetching: false,
        lastUpdated: moment.utc()
    };

    // Replace the result
    currentState.delete(action.payload.queryId);
    currentState.set(action.payload.queryId, newQueryResultState);
    
    return new Map<string, QueryResultStoreState>(currentState);
}

/**
 * Modify the store state once failed getting query result 
 * @param currentState The store current state
 */
function onGetQueryResultFail(action: GetQueryResultFailAction, currentState: Map<string, QueryResultStoreState>)
        : Map<string, QueryResultStoreState> {
    let newQueryResultState: QueryResultStoreState = {
        result: null,
        isFetching: false,
        lastUpdated: null,
        failureReason: {
            error: action.payload.error
        }
    };

    // Replace the result
    currentState.delete(action.payload.queryId);
    currentState.set(action.payload.queryId, newQueryResultState);
    
    return new Map<string, QueryResultStoreState>(currentState);
}