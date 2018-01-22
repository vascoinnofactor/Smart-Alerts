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
    AddAlertRuleSuccessAction,
    AddAlertRuleFailAction
} from './alertRule/add';
import {
    GetQueryResultInProgressAction,
    GetQueryResultSuccessAction,
    GetQueryResultFailAction
} from './queryResult/get';
import {
    LoginSuccessAction
} from './authentication';

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
                   GetQueryResultFailAction |
                   LoginSuccessAction;

export default ActionTypes;