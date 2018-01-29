// -----------------------------------------------------------------------
// <copyright file="logAnalyticsApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ApiError from './apiError';
import DataTable from '../models/DataTable';
import { ConvertLogAnalyticsResponseToDataTable } from '../utils/KustoResponseParser';
import { getWorkspaceId } from './azureResourceManagementApi';
import { logAnalyticsUrl } from './urls';

/**
 * Execute a query against Log Analytics API
 */
export async function executeQuery(resourceIds: string[], query: string, authenticationToken: string)
        : Promise<DataTable> {
    let workspaceId = await getWorkspaceId(resourceIds[0]);

    const requestUrl = `${logAnalyticsUrl}/${workspaceId}/query`;

    // Add the required headers    
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + authenticationToken);
    headers.append('Content-Type', 'application/json');
    
    let requestBody = {};
    // tslint:disable-next-line:no-string-literal
    requestBody['query'] = query;
    
    if (resourceIds.length > 1) {
        // tslint:disable-next-line:no-string-literal
        requestBody['workspaces'] = resourceIds.slice(1);
    }

    // Create the request data
    const requestInit: RequestInit = {
        body: JSON.stringify(requestBody),
        headers,
        method: 'POST',
        mode: 'cors'
    };

    // Execute the reqest
    const response = await fetch(requestUrl, requestInit);

    if (response.ok) {
        let dataTable = ConvertLogAnalyticsResponseToDataTable(await response.json());
        return dataTable;
    } else {
        throw new ApiError(response.status, response.statusText);
    }
}