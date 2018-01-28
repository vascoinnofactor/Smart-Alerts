// -----------------------------------------------------------------------
// <copyright file="queryResultActions.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Dispatch } from 'redux';

import keys from '../actionTypeKeys';
import {
    GetQueryResultInProgressAction,
    GetQueryResultSuccessAction,
    GetQueryResultFailAction
} from './get';
import StoreState from '../../store/StoreState';
import { executeQuery as executeApplicationInsightsQuery } from '../../api/applicationInsightsApi';
import { executeQuery as executeLogAnalyticsQuery } from '../../api/logAnalyticsApi';
import DataTable from '../../models/DataTable';
import ActiveDirectoryAuthenticator from '../../utils/adal/ActiveDirectoryAuthenticator';
import QueryRunInfo from '../../models/QueryRunInfo';
import ActiveDirectoryAuthenticatorFactory from '../../factories/ActiveDirectoryAuthenticatorFactory';
import { DataSource } from '../../enums/DataSource';

/**
 * Create an action for executing the given query
 */
export function getQueryResult(queryId: string,
                               query: string,
                               queryRunInfo: QueryRunInfo)
        : (dispatch: Dispatch<StoreState>, getState: () => StoreState) => Promise<void> {
    return async (dispatch: Dispatch<StoreState>, getState: () => StoreState) => {
        // 1. Check if query id is already stored - TODO
        let currentStoreState = getState();
        let queryResult = currentStoreState.queryResults.get(queryId);

        // In case query was already executed - notify about the result (maybe other components are still waiting)
        if (queryResult && queryResult.result) {
            dispatch(getQueryResultSuccessAction(queryId, queryResult.result));

            return;
        }

        // In case query was already executed but failed - notify failure
        if (queryResult && queryResult.failureReason) {
            dispatch(getQueryResultFailAction(queryId, queryResult.failureReason.error));

            return;
        }

        dispatch(getQueryResultInProgressAction(queryId));

        // 2. In case not - generate a Azure AAD token 
        let authenticator: ActiveDirectoryAuthenticator = ActiveDirectoryAuthenticatorFactory
                                                            .getActiveDirectoryAuthenticator();

        // Check which resource we should generate a token against
        let resourceId = queryRunInfo.type === DataSource.ApplicationInsights ? 
                                                            'https://api.applicationinsights.io' :
                                                            'https://api.loganalytics.io';

        try {
            // Generate a resource token (for AI/Log Analytics)
            let resourceToken = await authenticator.getResourceTokenAsync(resourceId);

            // 3. Execute the query against the correct endpoint
            const queryResponse = queryRunInfo.type === DataSource.ApplicationInsights ?
            await executeApplicationInsightsQuery(queryRunInfo.resourceIds, query, resourceToken) :
            await executeLogAnalyticsQuery(queryRunInfo.resourceIds, query, resourceToken);
            
            dispatch(getQueryResultSuccessAction(queryId, queryResponse));
        } catch (error) {
                dispatch(getQueryResultFailAction(queryId, error));
        }
    };
}

/**
 * Create an action once getting the query execution is in progress
 */
function getQueryResultInProgressAction(queryId: string): GetQueryResultInProgressAction {
    return {
        type: keys.GET_QUERY_RESULT_INPROGRESS,
        payload: {
            queryId: queryId
        }
    };
}

/**
 * Create an action once getting the query execution finished successfuly
 * @param signalsResults the retrieved signals results
 */
function getQueryResultSuccessAction(queryId: string, queryResponse: DataTable): GetQueryResultSuccessAction {
    return {
        type: keys.GET_QUERY_RESULT_SUCCESS,
        payload: {
            queryId: queryId,
            result: queryResponse
        }
    };
}

/**
 * Create an action once executing the query finished with error
 * @param error The error information
 */
function getQueryResultFailAction(queryId: string, error: Error): GetQueryResultFailAction {
    return {
        type: keys.GET_QUERY_RESULT_FAIL,
        payload: {
            queryId: queryId,
            error: error
        }
    };
}