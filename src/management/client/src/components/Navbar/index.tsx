// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import Avatar from 'react-md/lib/Avatars';

import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import AddAlertRule from '../../pages/AlertRule';
import ViewAlertRules from '../../components/AlertRule/ViewAlertRules';
import SignalResultsView from '../../components/SignalResults/signalResultsView';
import SignalsView from '../../components/Signals/SignalsManagement/signalsView';
import User from '../../models/User';
import StoreState from '../../store/StoreState';

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
          to="/alertRules"
          leftIcon={<FontIcon className="item-icon">{'add_alert'}</FontIcon>}
          tileClassName="md-list-tile--mini"
          primaryText={name || 'Dashboard'}
          className="navbar-item-list"
        />
    ),
    (
        <ListItem
          key={1003}
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
 * Represents the Navbar component props for the component inner state  
 */
interface NavbarStateProps {
  isAuthenticated: boolean;
  userDetails: User | null;
}

// Create a type combined from all the props
type NavbarProps = NavbarStateProps;

/**
 * The component represents the navigation bar
 */
class Navbar extends React.PureComponent<NavbarProps> {
    public render() {
        const toolbarActions = [
            (
                <Avatar>
                    {
                    this.props.isAuthenticated && this.props.userDetails ?
                        this.props.userDetails.firstName.charAt(0).toUpperCase() :
                        '?'
                    }
                </Avatar>
            )
        ];

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
              toolbarActions={toolbarActions}
              visible={false}
            >
              <Switch>
                <Route 
                    path="/signalResults/:id?" 
                    render={(props) => 
                        <SignalResultsView selectedSignalResultId={props.match.params.id} />
                    }
                />
                <Route 
                    path="/signals/:id?" 
                    render={(props) => 
                        <SignalsView />
                    }
                />
                <Route 
                    path="/alertRules/add" 
                    render={(props) => 
                        <AddAlertRule />
                    }
                />
                <Route 
                    path="/alertRules" 
                    render={(props) => 
                        <ViewAlertRules />
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

/**
 * Map between the given state to this component props.
 * @param state The current state
 * @param ownProps the component's props
 */
function mapStateToProps(state: StoreState): NavbarStateProps {
    return {
        isAuthenticated: state.isAuthenticated,
        userDetails: state.userDetails
    };
}

// Casting to any in order to prevent the competability issue with Redux - Router
// tslint:disable-next-line:no-any
export default withRouter(connect(mapStateToProps)(Navbar) as any);