// -----------------------------------------------------------------------
// <copyright file="signalResultsFilters.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import { SelectField } from 'react-md/lib/SelectFields';

import './signalResultsFiltersStyle.css';

/**
 * Represents the SignalResultsFilters component props for the incoming properties 
 */
interface SignalResultsFiltersProps {
    subscriptions: string[];
    resourceGroups?: string[];
    resourceType?: string[];
    resourceNames?: string[];
    alertTypes?: string[];
}

/**
 * This component represents the filter bar in the signals results page
 */
export default class SignalResultsFilters extends React.Component<SignalResultsFiltersProps> {
    constructor(props: SignalResultsFiltersProps) {
        super(props);
    }

    render() {
        return (
            <div className="select-fields-container">
                <SelectField
                    id="subscriptionSelectField"
                    className="sub-menu-item"
                    placeholder="Subscription"
                    menuItems={this.props.subscriptions}
                    position={SelectField.Positions.BELOW}
                    simplifiedMenu
                    dropdownIcon={(<div/>)}
                />  
                <SelectField
                    id="resourceGroupSelectField"
                    className="sub-menu-item"
                    placeholder="Resource group"
                    menuItems={this.props.subscriptions}
                    position={SelectField.Positions.BELOW}
                    simplifiedMenu
                    dropdownIcon={(<div/>)}
                />
                <SelectField
                    id="resourceTypeSelectField"
                    className="sub-menu-item"
                    placeholder="Resource type"
                    menuItems={this.props.subscriptions}
                    position={SelectField.Positions.BELOW}
                    simplifiedMenu
                    dropdownIcon={(<div/>)}
                />  
                <SelectField
                    id="resourceNameSelectField"
                    className="sub-menu-item"
                    placeholder="Resource name"
                    menuItems={this.props.subscriptions}
                    position={SelectField.Positions.BELOW}
                    simplifiedMenu
                    dropdownIcon={(<div/>)}
                />
                <SelectField
                    id="alertTypeSelectField"
                    className="sub-menu-item"
                    placeholder="Alert type"
                    menuItems={this.props.subscriptions}
                    position={SelectField.Positions.BELOW}
                    simplifiedMenu
                    dropdownIcon={(<div/>)}
                />
            </div>
        );
    }
}