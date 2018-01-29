// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import DataTable from '../../models/DataTable';
import BarsChart from '../../models/Charts/BarsChart';
import Column from '../../models/Column';

/**
 * The data formater for a bars chart
 * @param dataTable The data table
 */
export default function barsDataFormat(dataTable: DataTable): BarsChart  {
    // Get all the columns which are numeric values
    let numericColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'int' ||
                                                                              column.dataType === 'long');
    let xAxisDataKey: string;

    // Find the x-axis data key
    // First we are trying to find datetime, if not - take the first column
    let timestampColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'datetime');

    if (!timestampColumns || timestampColumns.length === 0) {
        let firstColumn = dataTable.columnsMetadata[0];
        xAxisDataKey = firstColumn.name;

        // Remove the first column (if exists) from the numeric columns
        let xAxisInNumericColumnsIndex = numericColumns.indexOf(firstColumn);
        if (xAxisInNumericColumnsIndex !== -1) {
            numericColumns.splice(xAxisInNumericColumnsIndex, 1);
        }
    } else {
        xAxisDataKey = timestampColumns[0].name;
    }
    
    return {
        data: dataTable.data,
        numericDataKeys: numericColumns.map(column => column.name),
        xAxisDataKey: xAxisDataKey,
        barsDataKeys: numericColumns.map(column => column.name)
    };
}