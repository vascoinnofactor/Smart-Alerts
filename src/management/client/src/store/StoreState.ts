// -----------------------------------------------------------------------
// <copyright file="StoreState.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';

import Signal from '../models/Signal';
import SignalResult from '../models/SignalResult';
import DataTable from '../models/DataTable';
import User from '../models/User';
import AlertRule from '../models/AlertRule';
import AzureSubscriptionResources from '../models/AzureSubscriptionResources';

/**
 * Defines the store structure
 */
export default interface StoreState {
    /**
     * The list of Smart Signals
     */
    readonly signals: SignalsStoreState;

    /**
     * The list of signals results
     */
    readonly signalsResults: SignalsResultsStoreState;

    /**
     * The mapping between the signals results queries ids to their results
     */
    readonly queryResults: Map<string, QueryResultStoreState>;

    /**
     * The list of alert rules
     */
    readonly alertRules: AlertRulesStoreState;

    /**
     * An indication whether the user is authenticated
     */
    readonly isAuthenticated: boolean;

    /**
     * The authenticated user details
     */
    readonly userDetails: User | null;

    /**
     * The list of available Azure resources
     */
    readonly resources: ResourcesStoreState;
}

/**
 * Defines the resources store state
 */
export interface ResourcesStoreState {
    isFetching: boolean;
    azureSubscriptionsResources: ReadonlyArray<AzureSubscriptionResources>;
}

/**
 * Defines the signals store state
 */
export interface SignalsStoreState {
    isFetching: boolean;
    items: ReadonlyArray<Signal>;
    lastUpdated: Moment | null;
    failureReason?: FailureReason;
}

/**
 * Defines the signals results store state
 */
export interface SignalsResultsStoreState {
    isFetching: boolean;
    items: ReadonlyArray<SignalResult>;
    lastUpdated: Moment | null;
    failureReason?: FailureReason;
}

/**
 * Defines the query results store state
 */
export interface QueryResultStoreState {
    isFetching: boolean;
    result: DataTable | null;
    lastUpdated: Moment | null;
    failureReason?: FailureReason;
}

/**
 * Defines the alert rules results store state
 */
export interface AlertRulesStoreState {
    isFetching: boolean;
    isUpdating: boolean;
    items: ReadonlyArray<AlertRule>;
    lastUpdated: Moment | null;
    failureReason?: FailureReason;
}

export interface FailureReason {
    error: Error;
}