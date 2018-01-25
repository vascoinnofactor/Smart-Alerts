// -----------------------------------------------------------------------
// <copyright file="managementSubMenu.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Link } from 'react-router-dom';

import './managementSubMenuStyle.css';

/**
 * This component represents the management bar for installing/creating a signal
 */
export default class ManagementSubMenu extends React.Component {
    public render() {
        return (
            <div className="management-sub-menu-container">
                    <div className="sub-menu-item management-item">
                        <Link to="/signals/install">
                            Install Signal
                        </Link>
                    </div>

                    <div className="sub-menu-item management-item">
                        <Link to="/signals/create">
                            Create Signal
                        </Link>
                    </div>
            </div>
        );
    }
}