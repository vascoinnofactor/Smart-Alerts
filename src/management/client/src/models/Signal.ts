// -----------------------------------------------------------------------
// <copyright file="Signal.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import SignalConfiguration from './SignalConfiguration';
import ResourceType from '../enums/ResourceType';

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
    supportedCadences: number[];

    /**
     * Gets the signal supported resource types.
     */
    supportedResourceTypes: ResourceType[];

    /**
     * Gets the signal configurations.
     */
    configurations: ReadonlyArray<SignalConfiguration>;
}