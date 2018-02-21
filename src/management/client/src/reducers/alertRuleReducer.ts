// -----------------------------------------------------------------------
// <copyright file="alertRuleReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ActionTypeKeys from '../actions/actionTypeKeys';
import initialState from './initialState';
import ActionTypes from '../actions/actionTypes';
import { AlertRulesStoreState } from '../store/StoreState';
import { AddAlertRuleSuccessAction, AddAlertRuleFailAction } from '../actions/alertRule/add';
import { 
    GetAlertRuleSuccessAction,
    GetAlertRuleFailAction 
} from '../actions/alertRule/get';

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
        case ActionTypeKeys.GET_ALERT_RULE_INPROGRESS:
            return onGetAlertRuleInProgress(state);
        case ActionTypeKeys.GET_ALERT_RULE_SUCCESS:
            return onGetAlertRuleSuccess(action, state);
        case ActionTypeKeys.GET_ALERT_RULE_FAIL:
            return onGetAlertRuleFail(action, state);
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
        isUpdating: true
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
        isUpdating: false,
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
        isUpdating: false,
        failureReason: {
            error: action.payload.error
        }
    };
}

/**
 * Modify the store state once getting alert rule operation started
 * @param action The get alert rule in progress action
 * @param currentState The store current state
 */
function onGetAlertRuleInProgress(currentState: AlertRulesStoreState)
    : AlertRulesStoreState {
    return {
        ...currentState,
        isFetching: true
    };
}

/**
 * Modify the store state once getting alert rule was completed successfuly
 * @param action The get alert rule success action
 * @param currentState The store current state
 */
function onGetAlertRuleSuccess(action: GetAlertRuleSuccessAction, currentState: AlertRulesStoreState)
    : AlertRulesStoreState {
    return {
        ...currentState,
        items: action.payload.alertRules,
        isFetching: false,
        lastUpdated: null
    };
}

/**
 * Modify the store state once failed getting alert rules 
 * @param action The get alert rule failed action
 * @param currentState The store current state
 */
function onGetAlertRuleFail(action: GetAlertRuleFailAction, currentState: AlertRulesStoreState)
    : AlertRulesStoreState {
    return {
        ...currentState,
        isFetching: false,
        failureReason: {
            error: action.payload.error
        }
    };
}