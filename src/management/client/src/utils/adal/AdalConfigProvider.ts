// -----------------------------------------------------------------------
// <copyright file="AdalConfigProvider.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import AdalConfig from './AdalConfig';

/**
 * A provider class for getting the Azure Active Directory configuration
 */
export default class AdalConfigProvider { 
    /**
     * Get the Azure Active Directory (ADAL) configuration
     */
    public get getAdalConfig(): AdalConfig { 
        return {
            tenant: 'microsoft.onmicrosoft.com', 
            clientId: '7696b566-f71e-450a-8681-3b43cec4bef4',
            redirectUri: window.location.origin + '/login', 
            postLogoutRedirectUri: window.location.origin + '/',
            additionalQueryParameter: 'nux=1'
        };
    }
}