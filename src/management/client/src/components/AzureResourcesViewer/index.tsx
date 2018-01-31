// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import './indexStyle.css';

export default class AzureResourcesViewer extends React.Component {
    public render() {
        return (
            <div className="azure-resources-viewer">
                <div className="title">
                    Select a resource
                </div>

                <div className="description">
                    Select a resource that will be used to trigger the alerts, specify a subscription and 
                    filter by resource type to refine the resource list.
                </div>
                
                <div className="text-before-select-box">
                    * Filter by subscription
                </div>
                <select>
                    <option>first option</option>
                    <option>second option</option>
                </select>

                <div className="text-before-select-box">
                    * Filter by resource type
                </div>
                <select>
                    <option>first option</option>
                    <option>second option</option>
                </select>

                <div className="text-before-select-box">
                    * Resource
                </div>
                <select>
                    <option>first option</option>
                    <option>second option</option>
                </select>
            </div>
        );
    }
}