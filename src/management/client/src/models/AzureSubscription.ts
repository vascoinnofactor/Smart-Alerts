// -----------------------------------------------------------------------
// <copyright file="AzureSubscription.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

export default interface AzureSubscription {
    /**
     * The subscription id.
     */ 
    id: string;

    /**
     * The subscription name.
     */
    displayName: string;
}