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
import { executeQuery } from '../../api/applicationInsightsApi';
import DataTable from '../../models/DataTable';
import ActiveDirectoryAuthenticatorFactory from '../../factories/activeDirectoryAuthenticatorFactory';
import ActiveDirectoryAuthenticator from '../../utils/adal/ActiveDirectoryAuthenticator';
import { DataSource } from '../../enums/DataSource';

/**
 * Create an action for executing the given query
 */
export function getQueryResult(queryId: string,
                               applicationId: string,
                               query: string,
                               dataSource: DataSource)
        : (dispatch: Dispatch<StoreState>) => Promise<void> {
    return async (dispatch: Dispatch<StoreState>) => {
        dispatch(getQueryResultInProgressAction(queryId));

        // 1. Check if query id is already stored - TODO

        // 2. In case not - generate a Azure AAD token 
        let authenticator: ActiveDirectoryAuthenticator = ActiveDirectoryAuthenticatorFactory
                                                            .getActiveDirectoryAuthenticator();

        // Check which resource we should generate a token against
        let resourceToken = dataSource === DataSource.ApplicationInsights ? 
                                            'https://api.applicationinsights.io' :
                                            'https://api.loganalytics.io';

        authenticator.getResourceToken(resourceToken, async (message: string, token: string) => {
            if (message) {
                throw new Error('Failed to get AAD token: ' + message);
            }

            // 3. Execute the query against the correct endpoint
            try {
                const queryResponse = await executeQuery(applicationId, query, token);
    
                dispatch(getQueryResultSuccessAction(queryId, queryResponse));
            } catch (error) {
                dispatch(getQueryResultFailAction(queryId, error));
            }
        });
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