// -----------------------------------------------------------------------
// <copyright file="AlertRule.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ResourceType from '../enums/ResourceType';

/**
 * This model represents an alert rule 
 */
export default interface AlertRule {
    /**
     * Gets the signal id.
     */
    signalId: string;

    /**
     * Gets the resource type supported by the signal.
     */
    resourceType: ResourceType;

    /**
     * Gets the scheduling configuration (in CRON format).
     */
    schedule: string;
}