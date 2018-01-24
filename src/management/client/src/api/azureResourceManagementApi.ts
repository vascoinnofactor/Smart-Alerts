// -----------------------------------------------------------------------
// <copyright file="azureResourceManagementApi.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import ActiveDirectoryAuthenticatorFactory from '../factories/activeDirectoryAuthenticatorFactory';

/**
 * Execute a ARM query in order to get the Application Insights application id by a given resource id
 */
export async function getApplicationId(applicationResourceId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let activeDirectoryAuthenticator = ActiveDirectoryAuthenticatorFactory.getActiveDirectoryAuthenticator();
        
        activeDirectoryAuthenticator.getResourceToken('https://management.core.windows.net/',
                                                      async (message, token) => {
            // In case failed to get token - stop processing
            if (message) {
                reject({ message });
            }

            const requestUrl = `https://management.azure.com${applicationResourceId}?api-version=2014-04-01`;
            
            const headers = new Headers();

            // Add the required headers
            headers.append('Authorization', 'Bearer ' + token);
        
            // Create the request data
            const requestInit: RequestInit = {
                headers,
                method: 'GET',
                mode: 'cors'
            };
        
            // Execute the reqest
            const response = await fetch(requestUrl, requestInit);
        
            if (response.ok) {
                let applicationId = (await response.json()).properties.AppId;
                
                return resolve(applicationId);
            } else {
                reject(response.status);
            }
        });
    });
}

/**
 * Execute a ARM query in order to get the Log Analytics workspace id by a given resource id
 */
export async function getWorkspaceId(applicationResourceId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let activeDirectoryAuthenticator = ActiveDirectoryAuthenticatorFactory.getActiveDirectoryAuthenticator();
        
        activeDirectoryAuthenticator.getResourceToken('https://management.core.windows.net/',
                                                      async (message, token) => {
            // In case failed to get token - stop processing
            if (message) {
                reject({ message });
            }

            const requestUrl = `https://management.azure.com${applicationResourceId}?api-version=2017-04-26-preview`;
            
            const headers = new Headers();

            // Add the required headers
            headers.append('Authorization', 'Bearer ' + token);
        
            // Create the request data
            const requestInit: RequestInit = {
                headers,
                method: 'GET',
                mode: 'cors'
            };
        
            // Execute the reqest
            const response = await fetch(requestUrl, requestInit);
        
            if (response.ok) {
                let applicationId = (await response.json()).properties.customerId;
                
                return resolve(applicationId);
            } else {
                reject(response.status);
            }
        });
    });
}