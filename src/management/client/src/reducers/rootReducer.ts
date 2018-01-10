// -----------------------------------------------------------------------
// <copyright file="rootReducer.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { combineReducers } from 'redux';

import StoreState from '../store/StoreState';
import signalsResults from './signalResultReducer';
import signals from './signalReducer';

/**
 * Defines the root reducer - a combination of all the reducers.
 */
const rootReducer = combineReducers<StoreState>({
    signalsResults,
    signals
});

export default rootReducer;