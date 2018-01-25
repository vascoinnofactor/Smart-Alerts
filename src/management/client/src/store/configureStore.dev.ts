// -----------------------------------------------------------------------
// <copyright file="configureStore.dev.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { applyMiddleware, createStore } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import StoreState from './StoreState';

/**
 * Configure the store with all the required middlewares.
 * For development we are using the redux-immutable-state-invariant middleware which notifies in case we are modifying 
 * the state instead of keep it immutable
 */
export default function configureStore() {
  return createStore<StoreState>(
    rootReducer,
    applyMiddleware(thunkMiddleware, reduxImmutableStateInvariant())
  );
}