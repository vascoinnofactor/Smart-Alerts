// -----------------------------------------------------------------------
// <copyright file="KustoResponseParser.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { QueryResults, QueryResult } from '../models/QueryResults';
import DataTable from '../models/DataTable';
import Column from '../models/Column';

export function ConvertKustoResponseToDataTable(queryResults: QueryResults): DataTable {
    let resultTable: QueryResult = queryResults.tables[0];
    let rows: [{}] = [{}];
    let columnsMetadata: Column[] = [];

    resultTable.columns.forEach((column, columnIndex) => {
        // Keep this column metadata
        columnsMetadata.push({
            name: column.name,
            dataType: column.type
        });

        let columnName = column.name;

        resultTable.rows.forEach((row, rowIndex) => {
            if (!rows[rowIndex]) {
                rows.push({});
            }

            rows[rowIndex][columnName] = row[columnIndex];
        });
    });

    return {
        data: rows,
        columnsMetadata: columnsMetadata
    };
}