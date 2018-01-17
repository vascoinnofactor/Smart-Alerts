// -----------------------------------------------------------------------
// <copyright file="DataTable.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';

export default interface DataTable {
    timeColumnName: string;

    timeColumnValues: Moment[];

    numericValues: Map<string, number[]>;

    stringColumns: Map<string, string[]>;
}