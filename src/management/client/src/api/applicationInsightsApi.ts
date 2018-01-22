// -----------------------------------------------------------------------
// <copyright file="applicationInsightsApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ApiError from './apiError';
import DataTable from '../models/DataTable';
import { QueryResults, QueryResult } from '../models/QueryResults';
import Column from '../models/Column';

/**
 * Execute a query against Application Insights API
 */
export async function executeQuery(applicationId: string, query: string, apiKey?: string)
        : Promise<DataTable> {
    const requestUrl = `https://api.applicationinsights.io/v1/apps/${applicationId}/query`;

    const headers = new Headers();

    // TODO - remove it once fixed
    query = query.replace('piechat', 'piechart');

    // If apikey was given - use it, else create an authentication header using the user identity
    if (apiKey) {
        headers.append('x-api-key', apiKey);
        headers.append('Content-Type', 'application/json');
    }

    // Create the request data
    const requestInit: RequestInit = {
        body: JSON.stringify({ query: query}),
        headers,
        method: 'POST',
        mode: 'cors'
    };

    // Execute the reqest
    const response = await fetch(requestUrl, requestInit);

    if (response.ok) {
        let dataTable = convertToDataTable(await response.json());
        return dataTable;
    } else {
        throw new ApiError(response.status, response.statusText);
    }
}

function convertToDataTable(queryResults: QueryResults): DataTable {
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
        columnsMetadata: columnsMetadata,
        numericValues: new Map<string, number[]>(),
        stringColumns: new Map<string, string[]>(),
        timeColumnName: 'name',
        timeColumnValues: new Array(0)
    };
}

// function ConvertToDataTable(queryResults: QueryResults): DataTable {
//     let resultTable: QueryResult = queryResults.tables[0];
//     let timeColumnName: string;
//     let timeColumnValues: Moment[];
//     let numericColumnsData: Map<string, number[]> = new Map<string, number[]>();
//     let stringColumnsData: Map<string, string[]> = new Map<string, string[]>();

//     // Check which column is the timestamp one
//     let timestampColumnIndex = resultTable.columns.findIndex(column => column.type === 'datetime');

//     // In case we failed to find a timestamp column - throw an exception
//     if (timestampColumnIndex === -1) {
//         throw new Error('Failed to find datetime column');
//     }

//     // Save the time column name
//     timeColumnName = resultTable.columns[timestampColumnIndex].name;

//     // Save the time values
//     timeColumnValues = resultTable.rows.map((row => moment(row[timestampColumnIndex])));

//     // Get all the numeric columns names and save their metadata
//     let numericColumnsMetadata: { name: string, index: number }[] = 
//                                 new Array<{ name: string, index: number }>();
//     resultTable.columns.forEach((column, index) => {
//         if (column.type === 'long' || column.type === 'int') {
//             numericColumnsMetadata.push({
//                 name: column.name,
//                 index: index
//             });
//         }
//     });

//     // In case we failed to find any numeric columns - throw an exception
//     if (!numericColumnsMetadata) {
//         throw new Error('Failed to find numeric columns');
//     }

//     // Save the numeric columns and it's values
//     numericColumnsMetadata.forEach(column => {
//         // Add a mapping between the column name to his values
//         numericColumnsData.set(column.name, resultTable.rows.map(row => row[column.index]));
//     });

//     // Get all the string columns
//     let stringColumns = resultTable.columns.filter(column => column.type === 'string');

//     if (stringColumns.length > 0) {
//         // Get the string columns names
//         let stringColumnsMetadata = stringColumns.map((column, index) => {
//             return { columnName: column.name, columnIndex: index };
//         });

//         // Go over the string columns and extract their names and their rows values
//         stringColumnsMetadata.forEach(column => {
//             // Add a mapping between the column name to his values
//             stringColumnsData.set(column.columnName, resultTable.rows.map(row => row[column.columnIndex]));
//         });
//     }

//     return {
//         timeColumnName: timeColumnName,
//         timeColumnValues: timeColumnValues,
//         numericValues: numericColumnsData,
//         stringColumns: stringColumnsData
//     } as DataTable;
// }