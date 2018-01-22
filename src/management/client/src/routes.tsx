// -----------------------------------------------------------------------
// <copyright file="routes.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './components/Main/index';
import Login from './components/Login';
import AuthenticateRoute from './components/AuthenticateRoute';

interface RoutesProps {
  isAuthenticated: boolean;
}

/**
 * The routing function which directs us to the required component (by the given url).
 * As you can see our pages is protected is authentication, but the rendered component is Main
 * for all pages - that's because the content routing is happening in an inner component (Navbar/index.tsx),
 * so here we just want to configure that allowed path (so the authentication logic will know
 * where the user came from). 
 */
export default function Routes(props: RoutesProps) {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      
      <AuthenticateRoute 
        component={Main}
        authenticatePath="/login"
        isAuthenticated={props.isAuthenticated}  
        path="/signalResult"
      />

      <AuthenticateRoute 
        component={Main}
        authenticatePath="/login"
        isAuthenticated={props.isAuthenticated}  
        path="/signal"
      />
      
      <AuthenticateRoute 
        component={Main}
        authenticatePath="/login"
        isAuthenticated={props.isAuthenticated}  
        path="/"
      />
    </Switch>
  );
}