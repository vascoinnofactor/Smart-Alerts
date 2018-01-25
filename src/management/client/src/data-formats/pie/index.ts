// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import DataTable from '../../models/DataTable';
import PieChart from '../../models/Charts/PieChartData';
import Column from '../../models/Column';

/**
 * The data formater for a pie chart
 * @param dataTable The data table
 */
export default function pieDataFormat(dataTable: DataTable): PieChart  {
    // Get all the columns which are numeric values
    let numericColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'int' ||
                                                                              column.dataType === 'long');

    return {
        data: dataTable.data,
        numericDataKeys: numericColumns.map(column => column.name)
    };
}