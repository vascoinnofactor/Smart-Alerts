// -----------------------------------------------------------------------
// <copyright file="PropertyCategory.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

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