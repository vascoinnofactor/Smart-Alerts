// -----------------------------------------------------------------------
// <copyright file="signalResultApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import SignalResult from '../models/SignalResult';
import baseUrl from './baseUrl';
import ApiError from './apiError';

/**
 * Gets a list of signals results without any flitering
 */
export async function GetSignalsResults(): Promise<SignalResult[]> {
    const requestUrl = `${baseUrl}/api/signalResult`;

    // Throws TypeError for network error. 
    // See for details: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(requestUrl);
  
    if (response.ok) {
      return await response.json();
    } else {
      throw new ApiError(response.status, response.statusText);
    }
}