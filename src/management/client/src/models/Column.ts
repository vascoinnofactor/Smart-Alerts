// -----------------------------------------------------------------------
// <copyright file="Column.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

export default interface Column {
    /**
     * The column name.
     */
    name: string;

    /**
     * The column data type.
     */
    dataType: string;
}