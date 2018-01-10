// -----------------------------------------------------------------------
// <copyright file="AlertRule.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ResourceType from './ResourceType';

/**
 * This class represents the model of an alert rule 
 */
export default class AlertRule {
    /// <summary>
    /// Gets or sets the signal ID.
    /// </summary>
    public signalId: string;

    /// <summary>
    /// Gets or sets the resource type supported by the signal.
    /// </summary>
    public resourceType: ResourceType;

    /// <summary>
    /// Gets or sets the scheduling configuration (in CRON format).
    /// </summary>
    public schedule: string;
}