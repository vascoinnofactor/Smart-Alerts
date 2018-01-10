// -----------------------------------------------------------------------
// <copyright file="Signal.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import SignalConfiguration from './SignalConfiguration';

/**
 * This class represents the model of the Signal entity
 */
export default class Signal {
    /**
     * Gets the signal id.
     */
    public id: string;

    /**
     * Gets the signal name.
     */
    public name: string;

    /**
     * Gets the signal supported cadences (in minutes).
     */
    public SupportedCadences: number[];

    /**
     * Gets the signal configurations.
     */
    public configurations: ReadonlyArray<SignalConfiguration>;

    /**
     * Initializes a new instance of the Signal class
     * @param id The signal id.
     * @param name The signal name.
     * @param SupportedCadences The signal supported cadences (in minutes).
     * @param configurations The signal configurations.
     */
    constructor(id: string, name: string, SupportedCadences: number[], 
                configurations: ReadonlyArray<SignalConfiguration>) {
            this.id = id;
            this.name = name;
            this.SupportedCadences = SupportedCadences;
            this.configurations = configurations;
    }
}