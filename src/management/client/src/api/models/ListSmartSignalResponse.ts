// -----------------------------------------------------------------------
// <copyright file="ListSmartSignalResponse.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import Signal from '../../models/Signal';

/**
 * Represents the response model for the GET /signal endpoint
 */
export default class ListSmartSignalResponse {
    /**
     * Gets or list of Smart Signals
     */
    public signals: Signal[];
}