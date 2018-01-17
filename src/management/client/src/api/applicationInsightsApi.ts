// -----------------------------------------------------------------------
// <copyright file="applicationInsightsApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';
import * as moment from 'moment';

import ApiError from './apiError';
import DataTable from '../models/DataTable';
import { QueryResults, QueryResult } from '../models/QueryResults';

/**
 * Execute a query against Application Insights API
 */
export async function executeQuery(applicationId: string, query: string, apiKey?: string)
        : Promise<DataTable> {
    const requestUrl = `https://api.applicationinsights.io/v1/apps/${applicationId}/query`;

    const headers = new Headers();

    // If apikey was given - use it, else create an authentication header using the user identity
    if (apiKey) {
        headers.append('x-api-key', apiKey);
    }

    // Create the request data
    const requestInit: RequestInit = {
        body: JSON.stringify({ query: query}),
        headers,
        method: 'POST'
    };

    // Execute the reqest
    const response = await fetch(requestUrl, requestInit);

    if (response.ok) {
        let dataTable = ConvertToDataTable(await response.json());
        return dataTable;
    } else {
        throw new ApiError(response.status, response.statusText);
    }
}

function ConvertToDataTable(queryResults: QueryResults): DataTable {
    let resultTable: QueryResult = queryResults.Tables[0];
    let timeColumnName: string;
    let timeColumnValues: Moment[];
    let numericColumnsData: Map<string, number[]> = new Map<string, number[]>();
    let stringColumnsData: Map<string, string[]> = new Map<string, string[]>();

    // Check which column is the timestamp one
    let timestampColumnIndex = resultTable.columns.findIndex(column => column.columnType === 'datetime');

    // In case we failed to find a timestamp column - throw an exception
    if (timestampColumnIndex === -1) {
        throw new Error('Failed to find datetime column');
    }

    // Save the time column name
    timeColumnName = resultTable.columns[timestampColumnIndex].columnName;

    // Save the time values
    timeColumnValues = resultTable.rows.map((row => moment(row[timestampColumnIndex])));

    // Get all the numeric columns names
    let numericColumns = resultTable.columns.filter(column => column.columnType === 'long' || 
                                                              column.columnType === 'int');

    // In case we failed to find any numeric columns - throw an exception
    if (!numericColumns) {
        throw new Error('Failed to find numeric columns');
    }
    
    // Save the numeric columns names
    let numericColumnsMetadata = numericColumns.map((column, index) => {
        return { columnName: column.columnName, columnIndex: index };
    });

    // Save the numeric columns and it's values
    numericColumnsMetadata.forEach(column => {
        // Add a mapping between the column name to his values
        numericColumnsData.set(column.columnName, resultTable.rows.map(row => row[column.columnIndex]));
    });

    // Get all the string columns
    let stringColumns = resultTable.columns.filter(column => column.columnType === 'string');

    if (stringColumns.length > 0) {
        // Get the string columns names
        let stringColumnsMetadata = stringColumns.map((column, index) => {
            return { columnName: column.columnName, columnIndex: index };
        });

        // Go over the string columns and extract their names and their rows values
        stringColumnsMetadata.forEach(column => {
            // Add a mapping between the column name to his values
            stringColumnsData.set(column.columnName, resultTable.rows.map(row => row[column.columnIndex]));
        });
    }

    return {
        timeColumnName: timeColumnName,
        timeColumnValues: timeColumnValues,
        numericValues: numericColumnsData,
        stringColumns: stringColumnsData
    } as DataTable;
}