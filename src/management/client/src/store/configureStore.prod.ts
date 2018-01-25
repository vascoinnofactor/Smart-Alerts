// -----------------------------------------------------------------------
// <copyright file="configureStore.prod.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import StoreState from './StoreState';

/**
 * Configure the store with all the required middlewares.
 * For production we are using only the redux-thunk middleware.
 */
export default function configureStore() {
  return createStore<StoreState>(
    rootReducer,
    applyMiddleware(thunkMiddleware)
  );
}