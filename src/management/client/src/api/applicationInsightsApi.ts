// -----------------------------------------------------------------------
// <copyright file="applicationInsightsApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ApiError from './apiError';
import DataTable from '../models/DataTable';
import { ConvertKustoResponseToDataTable } from '../utils/KustoResponseParser';
import { getApplicationId } from './azureResourceManagementApi';

/**
 * Execute a query against Application Insights API
 */
export async function executeQuery(resourceIds: string[], query: string, authenticationToken: string)
        : Promise<DataTable> {
    // Get the application id for the first resource from the resources ids
    // When querying multiple AI resources you just need a single application id, the others can be resources ids
    let applicationId = await getApplicationId(resourceIds[0]);

    // Create the endpoint uri with the application id
    const requestUrl = `https://api.applicationinsights.io/v1/apps/${applicationId}/query`;
    
    // Add the required headers    
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + authenticationToken);
    headers.append('Content-Type', 'application/json');

    // Create the request body (we are using querying via POST request)
    let requestBody = {};
    // tslint:disable-next-line:no-string-literal
    requestBody['query'] = query;
    
    // In case there are multiple resources - add those
    if (resourceIds.length > 1) {
        // tslint:disable-next-line:no-string-literal
        requestBody['applications'] = resourceIds.slice(1);
    }

    // Create the request data
    const requestInit: RequestInit = {
        body: JSON.stringify(requestBody),
        headers,
        method: 'POST',
        mode: 'cors'
    };

    // Execute the reqest
    const response = await fetch(requestUrl, requestInit)
                     .catch((reason) => { 
                                throw new ApiError(500, 'Failed to query Application Insights: ' + reason);
                            });

    if (response.ok) {
        let dataTable = ConvertKustoResponseToDataTable(await response.json());
        return dataTable;
    } else {
        throw new ApiError(response.status, response.statusText);
    }
}