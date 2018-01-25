// -----------------------------------------------------------------------
// <copyright file="AdalUserConvertor.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import User from '../../models/User';

/**
 * A helper class for converting from ADAL user model to our internal model
 */
export default class AdalUserConvertor {
    /**
     * Convert the given ADAL user model to our internal model.
     * @param user The ADAL user model.
     */
    public static toUserModel(user: adal.User): User {
        return {
            firstName: user.profile.given_name,
            lastName: user.profile.family_name,
            email: user.profile.unique_name,
            imageUrl: 'someUrl'
        };
    }
}