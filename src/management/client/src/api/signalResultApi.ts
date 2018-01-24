// -----------------------------------------------------------------------
// <copyright file="signalResultApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import baseUrl from './baseUrl';
import ApiError from './apiError';
import ListSmartSignalResultResponse from './models/ListSmartSignalResultResponse';
import ActiveDirectoryAuthenticatorFactory from '../factories/ActiveDirectoryAuthenticatorFactory';

/**
 * Gets a list of signals results without any flitering
 */
export async function getSignalsResultsAsync(): Promise<ListSmartSignalResultResponse> {
    const requestUrl = `${baseUrl}/api/signalResult?startTime=1/23/2018 05:04`;

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