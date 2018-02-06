// -----------------------------------------------------------------------
// <copyright file="AlertRule.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * This model represents an alert rule 
 */
export default interface AlertRule {

    /**
     * The alert rule name.
     */
    name: string;

    /**
     * The alert rule description.
     */
    description?: string;

    /**
     * The signal id.
     */
    signalId: string;

    /**
     * The resource to be analyzed by the signal.
     */
    resourceId: string;

    /**
     * The scheduling configuration (in CRON format).
     */
    schedule: string;

    /**
     * The email recipients for the signal result.
     */
    emailRecipients?: string[];
}