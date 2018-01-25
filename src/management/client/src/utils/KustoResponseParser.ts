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
    let rows: {}[] = new Array<{}>();
    let columnsMetadata: Column[] = [];

    // TODO - temp solution for clear the array
    rows.pop();

    resultTable.columns.forEach((column, columnIndex) => {
        // Keep this column metadata
        columnsMetadata.push({
            name: column.name,
            dataType: column.type
        });

        let columnName = column.name;
        let resultRows = resultTable.rows;

        // TODO - this is a hack for LogAnalytics response data

        resultRows.forEach((row, rowIndex) => {
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

export function ConvertLogAnalyticsResponseToDataTable(queryResults: QueryResults): DataTable {
    let resultTable: QueryResult = queryResults.tables[0];
    let rows: [{}] = [{}];
    let columnsMetadata: Column[] = [];

    // TODO - temp solution for clear the array
    rows.pop();

    let resultRows = resultTable.rows;
    if (resultRows && resultRows.length > 0) {
        // tslint:disable-next-line:no-any
        var dataColumns: any[][] = new Array();

        // Convert rows response to list of columns (each list is a full column)
        resultRows[0].forEach((row, rowIndex) => {
            // First we need to parse it (as Log Analytics returns string results)
            let parsedColumn = JSON.parse(row.toString()) as Array<string|number>;
            
            dataColumns.push(parsedColumn);
        });

        // Go over the number of rows and create the data table
        let numberOfRows = dataColumns[0].length;

        for (let i = 0; i < numberOfRows; i++) {
            resultTable.columns.forEach((column, columnIndex) => {
                let columnName = column.name;

                // Make sure we created this row
                if (!rows[i]) {
                    rows.push({});
                }

                rows[i][columnName] = dataColumns[columnIndex][i];
            });
        }

        resultTable.columns.forEach((column, columnIndex) => {
            // Keep this column metadata
            columnsMetadata.push({
                name: column.name,
                dataType: column.type
            });
        });
    }

    return {
        data: rows,
        columnsMetadata: columnsMetadata
    };
}