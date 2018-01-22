// -----------------------------------------------------------------------
// <copyright file="activeDirectoryAuthenticatorFactory.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import AdalConfigProvider from '../utils/adal/AdalConfigProvider';
import ActiveDirectoryAuthenticator from '../utils/adal/ActiveDirectoryAuthenticator';

export default class ActiveDirectoryAuthenticatorFactory {
    private static adalConfigProvider: AdalConfigProvider;
    private static activeDirectoryAuthenticator: ActiveDirectoryAuthenticator;

    static initialize() {
        this.adalConfigProvider = new AdalConfigProvider();
        this.activeDirectoryAuthenticator = new ActiveDirectoryAuthenticator(this.adalConfigProvider);
    }

    public static getActiveDirectoryAuthenticator(): ActiveDirectoryAuthenticator {
        return this.activeDirectoryAuthenticator;
    }
}

ActiveDirectoryAuthenticatorFactory.initialize();