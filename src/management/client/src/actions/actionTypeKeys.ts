// -----------------------------------------------------------------------
// <copyright file="actionTypeKeys.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * Represents all the possible action types
 */
enum ActionTypeKeys {
    // Authentication action types
    SIGNIN_INPROGRESS = 'SIGNIN_INPROGRESS',
    SIGNIN_SUCCESS = 'SIGNIN_SUCCESS',
    SIGNIN_FAIL = 'SIGNIN_FAIL',
    SIGNOUT_INPROGRESS = 'SIGNOUT_INPROGRESS',
    SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS',
    SIGNOUT_FAIL = 'SIGNOUT_FAIL',

    // Get signal result action types
    GET_SIGNAL_RESULT_INPROGRESS = 'GET_SIGNAL_RESULT_INPROGRESS',
    GET_SIGNAL_RESULT_SUCCESS = 'GET_SIGNAL_RESULT_SUCCESS',
    GET_SIGNAL_RESULT_FAIL = 'GET_SIGNAL_RESULT_FAIL',

    // Get signals action types
    GET_SIGNAL_INPROGRESS = 'GET_SIGNAL_INPROGRESS',
    GET_SIGNAL_SUCCESS = 'GET_SIGNAL_SUCCESS',
    GET_SIGNAL_FAIL = 'GET_SIGNAL_FAIL',

    // Add alert rule action types
    ADD_ALERT_RULE_INPROGRESS = 'ADD_ALERT_RULE_INPROGRESS',
    ADD_ALERT_RULE_SUCCESS = 'ADD_ALERT_RULE_SUCCESS',
    ADD_ALERT_RULE_FAIL = 'ADD_ALERT_RULE_FAIL',

    // Get alert rule action types
    GET_ALERT_RULE_INPROGRESS = 'GET_ALERT_RULE_INPROGRESS',
    GET_ALERT_RULE_SUCCESS = 'GET_ALERT_RULE_SUCCESS',
    GET_ALERT_RULE_FAIL = 'GET_ALERT_RULE_FAIL',

    GET_QUERY_RESULT_INPROGRESS = 'GET_QUERY_RESULT_INPROGRESS',
    GET_QUERY_RESULT_SUCCESS = 'GET_QUERY_RESULT_SUCCESS',
    GET_QUERY_RESULT_FAIL = 'GET_QUERY_RESULT_FAIL'
}

export default ActionTypeKeys;