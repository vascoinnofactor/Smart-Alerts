// -----------------------------------------------------------------------
// <copyright file="actionTypes.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * This class represents all the possible actions we are supporting.
 */
import {
    GetSignalResultInProgressAction,
    GetSignalResultSuccessAction,
    GetSignalResultFailAction
} from './signalResult/get';
import {
    GetSignalInProgressAction,
    GetSignalSuccessAction,
    GetSignalFailAction
} from './signal/get';
import {
    AddAlertRuleInProgressAction,
    AddAlertRuleFailAction,
    AddAlertRuleSuccessAction
} from './alertRule/add';
import {
    GetQueryResultInProgressAction,
    GetQueryResultSuccessAction,
    GetQueryResultFailAction
} from './queryResult/get';

type ActionTypes = GetSignalResultFailAction | 
                   GetSignalResultInProgressAction | 
                   GetSignalResultSuccessAction |
                   GetSignalInProgressAction |
                   GetSignalSuccessAction |
                   GetSignalFailAction |
                   AddAlertRuleSuccessAction |
                   AddAlertRuleInProgressAction | 
                   AddAlertRuleFailAction |
                   GetQueryResultInProgressAction |
                   GetQueryResultSuccessAction |
                   GetQueryResultFailAction;

export default ActionTypes;