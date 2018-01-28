// -----------------------------------------------------------------------
// <copyright file="azureResourceManagementApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ActiveDirectoryAuthenticatorFactory from '../factories/ActiveDirectoryAuthenticatorFactory';

/**
 * Execute a ARM query in order to get the Application Insights application id by a given resource id
 */
export async function getApplicationId(applicationResourceId: string): Promise<string> {
    let armResponse = getResourceFromArm(applicationResourceId);

    // tslint:disable-next-line:no-string-literal
    return armResponse['properties']['AppId'];
}

/**
 * Execute a ARM query in order to get the Log Analytics workspace id by a given resource id
 */
export async function getWorkspaceId(workspaceResourceId: string): Promise<string> {
    let armResponse = getResourceFromArm(workspaceResourceId);

    // tslint:disable-next-line:no-string-literal
    return armResponse['properties']['customerId'];
}

/**
 * By a given resource id, get the resource metadata from the ARM endpoint
 * @param resourceId The resource id
 */
async function getResourceFromArm(resourceId: string): Promise<{}> {
    // 1. Get a resource token against ARM
    let activeDirectoryAuthenticator = ActiveDirectoryAuthenticatorFactory.getActiveDirectoryAuthenticator();
    let armResourceToken = await activeDirectoryAuthenticator
                                        .getResourceTokenAsync('https://management.core.windows.net/');

    // 2. Query ARM against the given application resource id
    const requestUrl = `https://management.azure.com${resourceId}?api-version=2014-04-01`;

    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + armResourceToken);

    // Create the request data
    const requestInit: RequestInit = {
        headers,
        method: 'GET',
        mode: 'cors'
    };

    // Execute the reqest
    const response = await fetch(requestUrl, requestInit);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(response.statusText);
    }    
}