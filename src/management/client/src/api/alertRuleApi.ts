// -----------------------------------------------------------------------
// <copyright file="alertRuleApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import baseUrl from './baseUrl';
import ApiError from './apiError';
import ActiveDirectoryAuthenticatorFactory from '../factories/ActiveDirectoryAuthenticatorFactory';
import { azureResourceManagementUrl } from './urls';
import AlertRule from '../models/AlertRule';
import ListAlertRulesResponse from './models/ListAlertRulesResponse';

/**
 * Add new alert rule 
 */
export async function addAlertRuleAsync(alertRule: AlertRule): Promise<void> {
    const requestUrl = `${baseUrl}/api/alertRule`;

    // Get the user AAD token
    let userAccessToken = await ActiveDirectoryAuthenticatorFactory.getActiveDirectoryAuthenticator()
                                                        .getResourceTokenAsync(azureResourceManagementUrl);

    const headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userAccessToken);
    headers.set('Content-Type', 'application/json');

    const requestInit: RequestInit = {
        body: JSON.stringify(alertRule),
        headers,
        method: 'POST',
        mode: 'cors'
    };

    const response = await fetch(requestUrl, requestInit);

    if (response.ok) {
      return await response.json();
    } else {
      throw new ApiError(response.status, response.statusText);
    }
}

/**
 * Get the alert rules 
 */
export async function getAlertRulesAsync(): Promise<ListAlertRulesResponse> {
  const requestUrl = `${baseUrl}/api/alertRule`;

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