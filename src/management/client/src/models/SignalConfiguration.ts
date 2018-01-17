// -----------------------------------------------------------------------
// <copyright file="SignalConfiguration.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * This model represents the Signal configuration
 */
export default interface SignalConfiguration {
    /**
     * Gets the signal configuration id.
     */
    id: string;

    /**
     * Gets the signal configuration name.
     */
    name: string;

    /**
     * Gets the signal configuration type.
     */
    type: string;
}