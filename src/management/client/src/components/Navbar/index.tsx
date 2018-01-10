// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import { withRouter } from 'react-router';
import { Switch, Route, Link } from 'react-router-dom';

import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';

import SignalResultsPage from '../../pages/SignalResults';
import SignalsPage from '../../pages/Signals';

import './indexStyle.css';

/**
 * Define the navigation items which will be presented in the navigation bar
 */
const navigationItems = [
    (
      <ListItem
        key={1001}
        component={Link}
        to="/signalResults"
        leftIcon={<FontIcon className="item-icon">{'lightbulb_outline'}</FontIcon>}
        tileClassName="md-list-tile--mini"
        primaryText={name || 'Dashboard'}
        className="navbar-item-list"
      />
    ),
    (
        <ListItem
          key={1002}
          component={Link}
          to="/signals"
          leftIcon={<FontIcon className="item-icon">{'settings'}</FontIcon>}
          tileClassName="md-list-tile--mini"
          primaryText={name || 'Dashboard'}
          className="navbar-item-list"
        />
    )
  ];

/**
 * The component represents the navigation bar
 */
export class Navbar extends React.PureComponent {
    public render() {
        return (
            <NavigationDrawer
              toolbarTitle={this.getToolbarTitle()}
              mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
              tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
              desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
              navItems={navigationItems}
              contentId="main-demo-content"
              drawerClassName="backgroundColor"
              temporaryIcon={<img src="/Azure.png" className="logo"/>}
              visible={false}
            >
                <Switch>
                    <Route 
                      path="/signalResults/:id?" 
                      render={(props) => 
                        <SignalResultsPage selectedSignalResultNumber={props.match.params.id} />
                      }
                    />
                    <Route 
                      path="/signals/:id?" 
                      render={(props) => 
                        <SignalsPage selectedSignalNumber={props.match.params.id}/>
                      }
                    />
                </Switch>
            </NavigationDrawer>
        );
    }

    private getToolbarTitle(): JSX.Element {
      return (
        <div className="toolbar-title">
          Azure Smart Alerts  <div className="preview-style">preview</div>
        </div>
      );
    }
}

export default withRouter(Navbar);