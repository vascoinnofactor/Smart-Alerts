// -----------------------------------------------------------------------
// <copyright file="signalApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import baseUrl from './baseUrl';
import ApiError from './apiError';
import ListSmartSignalResponse from './models/ListSmartSignalResponse';
import ActiveDirectoryAuthenticatorFactory from '../factories/ActiveDirectoryAuthenticatorFactory';

/**
 * Get a list of signals without any filtering
 */
export async function getSignalsAsync(): Promise<ListSmartSignalResponse> {
    const requestUrl = `${baseUrl}/api/signal`;

    // Get the user AAD token
    let userAccessToken = ActiveDirectoryAuthenticatorFactory.getActiveDirectoryAuthenticator().accessToken;

    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + userAccessToken);

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