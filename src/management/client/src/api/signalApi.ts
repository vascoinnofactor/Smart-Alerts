// -----------------------------------------------------------------------
// <copyright file="signalApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import baseUrl from './baseUrl';
import ApiError from './apiError';
import ListSmartSignalResponse from './models/ListSmartSignalResponse';

/**
 * Get a list of signals without any filtering
 */
export async function GetSignals(): Promise<ListSmartSignalResponse> {
    const requestUrl = `${baseUrl}/api/signal`;

    // Throws TypeError for network error. 
    // See for details: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(requestUrl);

    if (response.ok) {
      return await response.json();
    } else {
      throw new ApiError(response.status, response.statusText);
    }
}