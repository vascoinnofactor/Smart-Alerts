// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import keys from '../../actionTypeKeys';
import AlertRule from '../../../models/AlertRule';

/**
 * Represents an action once getting alert rules started.
 */
export interface GetAlertRuleInProgressAction {
    readonly type: keys.GET_ALERT_RULE_INPROGRESS;
}

/**
 * Represents an action getting alert rules finished successfuly.
 */
export interface GetAlertRuleSuccessAction {
    readonly type: keys.GET_ALERT_RULE_SUCCESS;
    readonly payload: {
        readonly alertRules: ReadonlyArray<AlertRule>;
    };
}

/**
 * Represents an action once there was a failure while getting the alert rules.
 */
export interface GetAlertRuleFailAction {
    readonly type: keys.GET_ALERT_RULE_FAIL;
    readonly payload: {
        readonly error: Error;
    };
}