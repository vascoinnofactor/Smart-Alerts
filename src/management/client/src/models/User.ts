// -----------------------------------------------------------------------
// <copyright file="User.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

export default interface User {
    /**
     * The user email.
     */ 
    email: string;

    /**
     * The user first name.
     */
    firstName: string;

    /**
     * The user last name.
     */
    lastName: string;

    /**
     * The user avatar image url.
     */
    imageUrl: string;
}