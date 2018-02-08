// -----------------------------------------------------------------------
// <copyright file="rootReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { combineReducers } from 'redux';

import StoreState from '../store/StoreState';
import signalsResults from './signalResultReducer';
import signals from './signalReducer';
import queryResults from './queryResultReducer';
import isAuthenticated from './isAuthenticatedReducer';
import userDetails from './userDetailsReducer';
import resources from './resourceReducer';

/**
 * Defines the root reducer - a combination of all the reducers.
 */
const rootReducer = combineReducers<StoreState>({
    signalsResults,
    signals,
    queryResults,
    isAuthenticated,
    userDetails,
    resources
});

export default rootReducer;