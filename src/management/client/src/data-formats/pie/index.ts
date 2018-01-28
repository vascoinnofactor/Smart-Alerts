// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as _ from 'lodash';

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

    let sectorColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'string');

    if (!sectorColumns || sectorColumns.length !== 1) {
        throw new Error('There must be at least one string columns');
    }

    // TODO - This logic is relevant only for 1 sector and 1 numeric column
    let sectorColumnName = sectorColumns[0].name;
    let numericColumnName = numericColumns[0].name;

    // Get a distinct values of all the string columns values
    let stringColumnsDistinctValues: string[] = _.uniq(dataTable.data.map(row => row[sectorColumnName]));

    let data: {}[] = new Array();
    stringColumnsDistinctValues.map(value => {
        // Take all the rows with this value
        let rowsForThisSector = dataTable.data.filter(row => row[sectorColumnName] === value);

        // Aggregate the numeric column (SUM aggregation)
        data.push({ name: value,
                    value: _.sum(rowsForThisSector.map(row => row[numericColumnName])) });
    });

    return {
        data: data,
        sectorDataKeys: ['name'],
        numericDataKeys: ['value']
    };
}