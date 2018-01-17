// -----------------------------------------------------------------------
// <copyright file="SignalResultProperty.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * This model represents a signal result property
 */
export default interface SignalResultProperty {
    /**
     * Gets the signal result property name.
     */
    name: string;

    /**
     * Gets the signal result property value.
     */
    value: string;

    /**
     * Gets the signal result property category.
     */
    displayCategory: PropertyCategory;

    /**
     * Gets the signal result property info ballon (optional).
     */
    infoBallon?: string;
}

/**
 * List all the possible property category values.
 */
export enum PropertyCategory {
    /**
     * Indicates a property belonging to the properties section.
     */
    Property = 0,

    /**
     * Indicates a property belonging to the analysis section.
     */
    Analysis = 1,

    /**
     * Indicates a property belonging to the charts section.
     */
    Chart = 2,

    /**
     * Indicates a property belonging to the additional queries section.
     */
    AdditionalQuery = 3
}