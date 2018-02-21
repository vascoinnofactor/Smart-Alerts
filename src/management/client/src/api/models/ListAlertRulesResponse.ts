// -----------------------------------------------------------------------
// <copyright file="ListAlertRulesResponse.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import AlertRule from '../../models/AlertRule';

/**
 * Represents the response model for the GET /resource endpoint
 */
export default class ListAlertRulesResponse {
    /**
     * The alert rules
     */
    public alertRules: ReadonlyArray<AlertRule>;
}