// -----------------------------------------------------------------------
// <copyright file="alertRuleReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ActionTypeKeys from '../actions/actionTypeKeys';
import initialState from './initialState';
import ActionTypes from '../actions/actionTypes';
import { AlertRulesStoreState } from '../store/StoreState';
import { AddAlertRuleSuccessAction, AddAlertRuleFailAction } from '../actions/alertRule/add/index';

/**
 * This reducer responsible for the alert rules state in the store
 */
export default function alertRuleReducer(
    state: AlertRulesStoreState = initialState.alertRules,
    action: ActionTypes
): AlertRulesStoreState  {
    switch (action.type) {
        case ActionTypeKeys.ADD_ALERT_RULE_INPROGRESS:
            return onAddAlertRuleInProgress(state);
        case ActionTypeKeys.ADD_ALERT_RULE_SUCCESS:
            return onAddAlertRuleSuccess(action, state);
        case ActionTypeKeys.ADD_ALERT_RULE_FAIL:
            return onAddAlertRuleFail(action, state);
        default:
            return state;
    }
}

/**
 * Modify the store state once adding alert rule is in progress
 * @param currentState The store current state
 */
function onAddAlertRuleInProgress(currentState: AlertRulesStoreState): AlertRulesStoreState {
    return {
        ...currentState,
        isFetching: true
    };
}

/**
 * Modify the store state once adding alert rule was completed successfuly
 * @param action The add alert rule success action
 * @param currentState The store current state
 */
function onAddAlertRuleSuccess(action: AddAlertRuleSuccessAction, currentState: AlertRulesStoreState)
    : AlertRulesStoreState {
    return {
        ...currentState,
        items: [...currentState.items, { ...action.payload.alertRule }],
        isFetching: false,
        lastUpdated: null
    };
}

/**
 * Modify the store state once failed adding alert rule 
 * @param action The add alert rule failed action
 * @param currentState The store current state
 */
function onAddAlertRuleFail(action: AddAlertRuleFailAction, currentState: AlertRulesStoreState)
    : AlertRulesStoreState {
    return {
        ...currentState,
        isFetching: false,
        failureReason: {
            error: action.payload.error
        }
    };
}