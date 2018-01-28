// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import DataTable from '../../models/DataTable';
import BarsChart from '../../models/Charts/BarsChart';
import Column from '../../models/Column';
import * as moment from 'moment';

/**
 * The data formater for a bars chart
 * @param dataTable The data table
 */
export default function barsDataFormat(dataTable: DataTable): BarsChart  {
    // Get all the columns which are numeric values
    let numericColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'int' ||
                                                                              column.dataType === 'long');

    let timestampColumn: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'datetime');

    let lines: string[] = [];

    // In case failed to find by column type - fallback to search manually
    if (numericColumns.length === 0 || timestampColumn.length === 0) {
        let firstRow = dataTable.data[0];
        let index = 0;

        // tslint:disable-next-line:forin
        for (var property in firstRow) {
            if (Number.isInteger(firstRow[property])) {
                numericColumns.push({
                    dataType: 'int',
                    name: dataTable.columnsMetadata[index].name
                });
            }

            if (moment(firstRow[property], 'yyyy-mm-ddTHH:00:00.0000000Z', true).isValid) {
                timestampColumn.push({
                    dataType: 'timestamp',
                    name: dataTable.columnsMetadata[index].name
                });
            }

            if ((typeof firstRow[property]) === 'number') {
                lines.push(dataTable.columnsMetadata[index].name);
            }

            index++;
        }
    }

    return {
        data: dataTable.data,
        numericDataKeys: numericColumns.map(column => column.name),
        xAxisDataKey: timestampColumn[0].name,
        barsDataKeys: numericColumns.map(column => column.name)
    };
}