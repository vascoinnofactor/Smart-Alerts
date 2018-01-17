// -----------------------------------------------------------------------
// <copyright file="StoreState.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';

import Signal from '../models/Signal';
import SignalResult from '../models/SignalResult';
import DataTable from '../models/DataTable';

/**
 * Defines the store structure
 */
export default interface StoreState {
    readonly signals: SignalsStoreState;
    readonly signalsResults: SignalsResultsStoreState;
    readonly queryResults: Map<string, QueryResultStoreState>;
}

/**
 * Defines the signals store state
 */
export interface SignalsStoreState {
    isFetching: boolean;
    items: ReadonlyArray<Signal>;
    lastUpdated: Moment | null;
}

/**
 * Defines the signals results store state
 */
export interface SignalsResultsStoreState {
    isFetching: boolean;
    items: ReadonlyArray<SignalResult>;
    lastUpdated: Moment | null;
}

export interface QueryResultStoreState {
    isFetching: boolean;
    result: DataTable;
    lastUpdated: Moment | null;
}