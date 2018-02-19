// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Drawer as MDDrawer } from 'react-md/lib/Drawers';

import './indexStyle.css';

/**
 * Represents the Drawer component props
 */
interface DrawerProps {
    visible: boolean;
    position?: 'left' | 'right';
    onVisibilityChange: (visible: boolean) => void;
    minWidth?: string;
    maxWidth?: string;
}

interface DrawerState {
    visible: boolean;
}

/**
 * This component represents a drawer which opens from the right (in default, can be override)
 * and presents the drawer children
 */
export default class Drawer extends React.Component<DrawerProps, DrawerState> {
    constructor(props: DrawerProps) {
        super(props);
        
        this.state = {
            visible: false
        };
    }

    public render() {
        return (
            <MDDrawer
                type={MDDrawer.DrawerTypes.TEMPORARY}
                visible={this.state.visible || this.props.visible}
                position={this.props.position ? this.props.position : 'right'}
                className="drawer"
                onVisibilityChange={this.handleVisibility}
                style={{ maxWidth: this.props.maxWidth, minWidth: this.props.minWidth }}
            >
                {this.props.children}
            </MDDrawer>
        );
    }

    private handleVisibility = (visible: boolean) => {
        this.setState({ visible: visible });
        this.props.onVisibilityChange(visible);
    }
}