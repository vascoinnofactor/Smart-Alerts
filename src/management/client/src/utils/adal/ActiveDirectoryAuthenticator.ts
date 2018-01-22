// -----------------------------------------------------------------------
// <copyright file="ActiveDirectoryAuthenticator.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import 'expose-loader?AuthenticationContext!adal-angular';

import AdalConfig from './AdalConfig';
import AdalConfigProvider from './AdalConfigProvider';
import User from '../../models/User';
import AdalUserConvertor from './AdalUserConvertor';

let AuthContext: adal.AuthenticationContextStatic = AuthenticationContext; 

export default class ActiveDirectoryAuthenticator {
    /**
     * The ADAL authentication context
     */
    private context: adal.AuthenticationContext; 

    /**
     * The ADAL configuration
     */
    private adalConfig: AdalConfig;

    /**
     * Initializes a new instance of the ActiveDirectoryAuthenticator class.
     * @param adalConfigProvider The ADAL config provider
     */
    constructor(adalConfigProvider: AdalConfigProvider) {
        const adalConfig: AdalConfig = adalConfigProvider.getAdalConfig;

        this.context = new AuthContext(adalConfig); 
        this.adalConfig = adalConfig;
    }
    
    public login() {
        this.context.login();
    }
    
    public logout() {
        this.context.logOut();
    }
    public handleCallback() {
        this.context.handleWindowCallback();
    }

    public get userInfo(): User {    
        let user = this.context.getCachedUser();

        return AdalUserConvertor.toUserModel(user);
    }
    
      public get accessToken(): string {
        return this.context.getCachedToken(this.adalConfig.clientId); 
    }
    
    public get isAuthenticated() {
        return this.accessToken && this.userInfo; 
    }
}
