// -----------------------------------------------------------------------
// <copyright file="SignalResultProperty.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * This class model represents a signal result property.
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
    category: PropertyCategory;

    /**
     * Gets the signal result property info ballon (optional).
     */
    infoBallon?: string;
}

/**
 * List all the possible property category values.
 */
export enum PropertyCategory {
    Summary,
    Chart,
    Analysis
}