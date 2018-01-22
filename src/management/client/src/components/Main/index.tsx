// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import Navbar from '../Navbar/index';

/**
 * This component is the main component which contains the most upper component
 * (in our case it's the navbar)
 */
export default class Main extends React.Component {
    public render() {
        return (
            <Navbar />
        );
    }
}