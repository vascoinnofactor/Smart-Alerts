// -----------------------------------------------------------------------
// <copyright file="SignalConfiguration.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * This class represents the model of the Signal configuration
 */
export default class SignalConfiguration {
    /**
     * Gets the signal configuration id.
     */
    public id: string;

    /**
     * Gets the signal configuration name.
     */
    public name: string;

    /**
     * Gets the signal configuration type.
     */
    public type: string;

    /**
     * Initializes a new instance of the SignalConfiguration class
     * @param id The signal configuration id.
     * @param name The signal configuration name.
     * @param type The signal configuration type.
     */
    constructor(id: string, name: string, type: string) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}