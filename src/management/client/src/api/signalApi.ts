// -----------------------------------------------------------------------
// <copyright file="signalApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import baseUrl from './baseUrl';
import ApiError from './apiError';
import ListSmartSignalResponse from './models/ListSmartSignalResponse';
import ActiveDirectoryAuthenticatorFactory from '../factories/ActiveDirectoryAuthenticatorFactory';
import { azureResourceManagementUrl } from './urls';

/**
 * Get a list of signals without any filtering
 */
export async function getSignalsAsync(): Promise<ListSmartSignalResponse> {
    const requestUrl = `${baseUrl}/api/signal`;

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