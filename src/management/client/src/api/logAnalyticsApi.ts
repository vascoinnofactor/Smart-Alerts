// -----------------------------------------------------------------------
// <copyright file="logAnalyticsApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ApiError from './apiError';
import DataTable from '../models/DataTable';
import { ConvertKustoResponseToDataTable } from '../utils/KustoResponseParser';
/**
 * Execute a query against Log Analytics API
 */
export async function executeQuery(workspaceId: string, query: string, authenticationToken: string)
        : Promise<DataTable> {
    const requestUrl = `https://api.loganalytics.io/v1/workspaces/${workspaceId}/query`;

    const headers = new Headers();

    // Add the required headers
    headers.append('Authorization', 'Bearer ' + authenticationToken);
    headers.append('Content-Type', 'application/json');

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
        let dataTable = ConvertKustoResponseToDataTable(await response.json());
        return dataTable;
    } else {
        throw new ApiError(response.status, response.statusText);
    }
}