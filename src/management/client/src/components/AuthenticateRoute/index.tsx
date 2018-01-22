// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';

interface AuthenticateRouteProps {
    isAuthenticated: boolean;
    authenticatePath: string;
    // tslint:disable-next-line:no-any
    component: React.ComponentClass<any> | React.StatelessComponent<any>;
    path: string;
}

export default class AuthenticateRoute extends React.Component<AuthenticateRouteProps> {
  public render() {
    const Component = this.props.component;
    
    // tslint:disable-next-line:no-any
    const render = (renderProps: RouteComponentProps<any>) => {
        let element = (
          <Redirect
            to={{
              pathname: this.props.authenticatePath,
              state: { from: renderProps.location }
            }}
          />
        );
    
        if (this.props.isAuthenticated) {
          element = <Component {...renderProps} />;
        }
    
        return element;
    };
    
    return <Route path={this.props.path} render={render} />;
  }
}