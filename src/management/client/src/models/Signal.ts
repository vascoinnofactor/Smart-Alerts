// -----------------------------------------------------------------------
// <copyright file="Signal.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import SignalConfiguration from './SignalConfiguration';

/**
 * This model represents the Signal entity
 */
export default interface Signal {
    /**
     * Gets the signal id.
     */
    id: string;

    /**
     * Gets the signal name.
     */
    name: string;

    /**
     * Gets the signal supported cadences (in minutes).
     */
    SupportedCadences: number[];

    /**
     * Gets the signal configurations.
     */
    configurations: ReadonlyArray<SignalConfiguration>;
}