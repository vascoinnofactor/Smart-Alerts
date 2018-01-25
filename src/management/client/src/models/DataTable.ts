// -----------------------------------------------------------------------
// <copyright file="DataTable.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import Column from './Column';

export default interface DataTable {
    data: {}[];

    columnsMetadata: Column[];
}