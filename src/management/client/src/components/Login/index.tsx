// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import ActiveDirectoryAuthenticator from '../../utils/adal/ActiveDirectoryAuthenticator';
import AdalConfigProvider from '../../utils/adal/AdalConfigProvider';
import StoreState from '../../store/StoreState';
import { loginSuccessed } from '../../actions/authentication/authenticationActions';
import User from '../../models/User';

/**
 * Represents the Login component props for the dispatch functions
 */
interface LoginDispatchProps {
    loginSuccessed: (userDetails: User) => (dispatch: Dispatch<StoreState>) => void;
}

/**
 * Represents the Login component props for the component inner state  
 * We only need the RouteComponent props - that's why the interface it empty
 */
interface LoginStateProps extends RouteComponentProps<{}> {}

// Create a type combined from all the props
type LoginProps = LoginDispatchProps & LoginStateProps;

/**
 * This component responsible for the AAD authentication login.
 * Once user is authenticated, the component's children will be rendered.
 * In case authentication failed, we will present an 'Unautherized' page.
 */
class Login extends React.Component<LoginProps> {
    /**
     * The ADAL configuration provider
     */
    private adalConfigProvider: AdalConfigProvider;

    /**
     * The active directory authenticator
     */
    private activeDirectoryAuthenticator: ActiveDirectoryAuthenticator;

    constructor(props: LoginProps) {
        super(props);

        this.adalConfigProvider = new AdalConfigProvider();
        this.activeDirectoryAuthenticator = new ActiveDirectoryAuthenticator(this.adalConfigProvider);
    }

    /**
     * After component is mount, do the following - 
     *  1. Handle url callback (AAD returns the access token in the url)
     *  2. Check if user is authenticated
     *      A. In case not - login using the AAD authenticator
     *      B. In case user is authenticated, execute the 'login successed' notification method
     */
    public componentDidMount() {
        this.activeDirectoryAuthenticator.handleCallback();
        
        if (!this.activeDirectoryAuthenticator.isAuthenticated) {
          this.activeDirectoryAuthenticator.login();
        } else {
            this.props.loginSuccessed(this.activeDirectoryAuthenticator.userInfo);
        }
    }

    public render() {
        // Decide what was the previous url before directed to this component ('/login')
        // We are doing it in order to support returning to the previous page 
        // (e.g. if the user wanted to direct to '/signals' but wasn't authenticated,
        //  after authentiation it will return to '/signals')
        // In case there was no previous location, go to main page ('/')
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        if (this.activeDirectoryAuthenticator.isAuthenticated) {
            return (<Redirect to={from} />);
        }
        
        // TODO - create 'unauthorized' page
        return null;
    }
}

/**
 * Map between the given dispatch to this component props actions.
 * @param dispatch the dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<StoreState>): LoginDispatchProps {
    return {
        loginSuccessed: bindActionCreators(loginSuccessed, dispatch)
    };
}

export default withRouter(connect(null, mapDispatchToProps)(Login));