// -----------------------------------------------------------------------
// <copyright file="ListSmartSignalResultResponse.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import SignalResult from '../../models/SignalResult';

/**
 * Represents the response model for the GET /signalResult endpoint
 */
export default class ListSmartSignalResultResponse {
    /**
     * Gets or list of Smart Signals Results
     */
    public signalsResults: SignalResult[];
}