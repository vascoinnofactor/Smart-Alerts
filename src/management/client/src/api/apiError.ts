// -----------------------------------------------------------------------
// <copyright file="apiError.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * Represents an error coming from the API
 */
export default class ApiError extends Error {
    constructor(public readonly status: number, message: string) {
      super(message);
    }
}