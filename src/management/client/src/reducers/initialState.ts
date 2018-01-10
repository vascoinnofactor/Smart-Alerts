// -----------------------------------------------------------------------
// <copyright file="initialState.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import StoreState from '../store/StoreState';

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
    }
};
  
export default defaultState;