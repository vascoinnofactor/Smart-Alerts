// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import DataTable from '../../models/DataTable';
import BarsChart from '../../models/Charts/BarsChart';
import Column from '../../models/Column';

export default function barsDataFormat(dataTable: DataTable): BarsChart  {
    // Get all the columns which are numeric values
    let numericColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'int' ||
                                                                              column.dataType === 'long');

    return {
        data: dataTable.data,
        numericFields: numericColumns.map(column => column.name)
    };
}