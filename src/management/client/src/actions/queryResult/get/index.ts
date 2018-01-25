// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import keys from '../../actionTypeKeys';
import DataTable from '../../../models/DataTable';

/**
 * Represents an action for getting the query result.
 */
export interface GetQueryResultInProgressAction {
    readonly type: keys.GET_QUERY_RESULT_INPROGRESS;
    readonly payload: {
        readonly queryId: string;
    };
}

/**
 * Represents an action once the query result retrieved successfuly.
 */
export interface GetQueryResultSuccessAction {
    readonly type: keys.GET_QUERY_RESULT_SUCCESS;
    readonly payload: {
        readonly queryId: string;
        readonly result: DataTable;
    };
}

/**
 * Represents an action once there was a failure while getting the query result.
 */
export interface GetQueryResultFailAction {
    readonly type: keys.GET_QUERY_RESULT_FAIL;
    readonly payload: {
        readonly queryId: string;
        readonly error: Error;
    };
}