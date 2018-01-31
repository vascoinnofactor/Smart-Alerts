// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import StoreState from '../../store/StoreState';
import Routes from '../../routes';

interface AppStateProps {
  isAuthenticated: boolean;
}

class App extends React.Component<AppStateProps> {
  public render() {
    return (
      <div>
        <Routes isAuthenticated={this.props.isAuthenticated} />
      </div>
    );
  }
}

/**
 * Map between the given state to this component props.
 * @param state The current state
 * @param ownProps the component's props
 */
function mapStateToProps(state: StoreState): AppStateProps {
    return {
        isAuthenticated: state.isAuthenticated
    };
}

// Casting to any in order to prevent the competability issue with Redux - Router
// tslint:disable-next-line:no-any
export default withRouter(connect(mapStateToProps)(App) as any);