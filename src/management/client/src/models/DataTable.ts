// -----------------------------------------------------------------------
// <copyright file="DataTable.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';

import Column from './Column';

export default interface DataTable {
    data: [{}];

    columnsMetadata: Column[];

    timeColumnName: string;

    timeColumnValues: Moment[];

    numericValues: Map<string, number[]>;

    stringColumns: Map<string, string[]>;
}