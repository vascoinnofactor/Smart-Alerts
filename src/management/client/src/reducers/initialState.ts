// -----------------------------------------------------------------------
// <copyright file="initialState.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import StoreState, { QueryResultStoreState } from '../store/StoreState';

/**
 * The initial (default) store state
 */
const defaultState: StoreState = {
    signals: {
        isFetching: false,
        items: [],
        lastUpdated: null
    },
    signalsResults: {
        isFetching: false,
        items: [],
        lastUpdated: null
    },
    queryResults: new Map<string, QueryResultStoreState>(),
    alertRules: {
        isFetching: false,
        items: [],
        lastUpdated: null
    },
    resources: {
        isFetching: false,
        azureSubscriptionsResources: [],
    },
    isAuthenticated: false,
    userDetails: null
};
  
export default defaultState;