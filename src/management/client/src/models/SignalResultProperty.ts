// -----------------------------------------------------------------------
// <copyright file="SignalResultProperty.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { PropertyCategory } from '../enums/PropertyCategory';

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