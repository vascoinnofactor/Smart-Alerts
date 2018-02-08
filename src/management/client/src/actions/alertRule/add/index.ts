// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import keys from '../../actionTypeKeys';
import AlertRule from '../../../models/AlertRule';

/**
 * Represents an action for adding alert rule is in progress.
 */
export interface AddAlertRuleInProgressAction {
    readonly type: keys.ADD_ALERT_RULE_INPROGRESS;
}

/**
 * Represents an action adding alert rule finished successfuly.
 */
export interface AddAlertRuleSuccessAction {
    readonly type: keys.ADD_ALERT_RULE_SUCCESS;
    readonly payload: {
        readonly alertRule: AlertRule;
    };
}

/**
 * Represents an action once there was a failure while adding an alert rule.
 */
export interface AddAlertRuleFailAction {
    readonly type: keys.ADD_ALERT_RULE_FAIL;
    readonly payload: {
        readonly error: Error;
    };
}