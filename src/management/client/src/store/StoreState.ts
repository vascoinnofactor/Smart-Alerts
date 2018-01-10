// -----------------------------------------------------------------------
// <copyright file="storeState.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import Signal from '../models/Signal';
import SignalResult from '../models/SignalResult';

/**
 * Defines the store structure
 */
export default interface StoreState {
    readonly signals: SignalsStoreState;
    readonly signalsResults: SignalsResultsStoreState;
}

/**
 * Defines the signals store state
 */
export interface SignalsStoreState {
    isFetching: boolean;
    items: ReadonlyArray<Signal>;
    lastUpdated: Date | null;
}

/**
 * Defines the signals results store state
 */
export interface SignalsResultsStoreState {
    isFetching: boolean;
    items: ReadonlyArray<SignalResult>;
    lastUpdated: Date | null;
}