// -----------------------------------------------------------------------
// <copyright file="alertRuleActions.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Dispatch } from 'redux';

import keys from '../actionTypeKeys';
import {
    AddAlertRuleInProgressAction,
    AddAlertRuleSuccessAction,
    AddAlertRuleFailAction
} from './add';
import StoreState from '../../store/StoreState';
import { addAlertRuleAsync } from '../../api/alertRuleApi';
import AlertRule from '../../models/AlertRule';

/**
 * Create an action for adding an alert rule
 */
export function addAlertRule(alertRule: AlertRule): (dispatch: Dispatch<StoreState>) => Promise<void> {
    return async (dispatch: Dispatch<StoreState>) => {
        // Notify add alert rule work has started
        dispatch(addAlertRuleInProgressAction());

        try {
            await addAlertRuleAsync(alertRule);
            
            dispatch(addAlertRuleSuccessAction(alertRule));
          } catch (error) {
            dispatch(addAlertRuleFailAction(error));
          }
    };
}

/**
 * Create an action once add an alert rule operation is in progress
 */
function addAlertRuleInProgressAction(): AddAlertRuleInProgressAction {
    return {
        type: keys.ADD_ALERT_RULE_INPROGRESS
    };
}

/**
 * Create an action once adding an alert rule operation finished successfuly
 * @param alertRule The added alert rule
 */
function addAlertRuleSuccessAction(alertRule: AlertRule): AddAlertRuleSuccessAction {
    return {
        type: keys.ADD_ALERT_RULE_SUCCESS,
        payload: {
            alertRule: alertRule
        }
    };
}

/**
 * Create an action once adding an alert rule operation finished with error
 * @param error The error information
 */
function addAlertRuleFailAction(error: Error): AddAlertRuleFailAction {
    return {
        type: keys.ADD_ALERT_RULE_FAIL,
        payload: {
            error: error
        }
    };
}