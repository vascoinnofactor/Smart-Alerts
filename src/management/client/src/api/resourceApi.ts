// -----------------------------------------------------------------------
// <copyright file="resourceApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import baseUrl from './baseUrl';
import ApiError from './apiError';
import ActiveDirectoryAuthenticatorFactory from '../factories/ActiveDirectoryAuthenticatorFactory';
import { azureResourceManagementUrl } from './urls';
import ListResourcesResponse from './models/ListResourcesResponse';

/**
 * Get a list of available resources
 */
export async function getResourcesAsync(): Promise<ListResourcesResponse> {
    const requestUrl = `${baseUrl}/api/resource`;

    // Get the user AAD token
    let userAccessToken = await ActiveDirectoryAuthenticatorFactory.getActiveDirectoryAuthenticator()
                                                                   .getResourceTokenAsync(azureResourceManagementUrl);

    const headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userAccessToken);
    headers.set('Content-Type', 'application/json');

    const requestInit: RequestInit = {
        headers,
        method: 'GET',
        mode: 'cors'
    };

    const response = await fetch(requestUrl, requestInit);

    if (response.ok) {
        return await response.json();
    } else {
        throw new ApiError(response.status, response.statusText);
    }
}