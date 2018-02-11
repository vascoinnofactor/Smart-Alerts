// -----------------------------------------------------------------------
// <copyright file="signalsListDrawerView.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md/lib/DataTables';
import Button from 'react-md/lib/Buttons';

import Signal from '../../../models/Signal';

import './signalsListDrawerViewStyle.css';

/**
 * Represents the SignalsListDrawerViewProps component props 
 */
interface SignalsListDrawerViewProps {
    signals: ReadonlyArray<Signal>;
    onDoneButtonPressed: (signal: Signal) => void;
}

interface SignalsListDrawerViewState {
    selectedRowIndex?: number;
}

/**
 * This component represents a list of signals in a drawer view
 */
export default class SignalsListDrawerView extends 
                        React.Component<SignalsListDrawerViewProps, SignalsListDrawerViewState> {
    constructor(props: SignalsListDrawerViewProps) {
        super(props);

        this.onRowSelected = this.onRowSelected.bind(this);
        this.onDoneButtonPressed = this.onDoneButtonPressed.bind(this);

        this.state = {
            selectedRowIndex: undefined
        };
    }

    public render() {
        return (
            <div className="signals-list-drawer-view">
                <div className="title">
                    Select a signal
                </div>

                <div className="description">
                    Select a signal which will run over the selected resource.
                </div>

                <DataTable plain>
                    <TableHeader>
                        <TableRow>
                            <TableColumn />
                            <TableColumn>SIGNAL NAME</TableColumn>
                            <TableColumn>MONITOR SERVICE</TableColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            this.props.signals.map((signal, index) => (
                                <TableRow 
                                    key={index}
                                    onCheckboxClick={this.onRowSelected}
                                    selected={this.state.selectedRowIndex === index}
                                    selectable
                                >
                                        <TableColumn>{signal.name}</TableColumn>
                                        <TableColumn>
                                            {signal.supportedResourceTypes.join(', ')}
                                        </TableColumn>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </DataTable>    
                <Button 
                    type="submit" 
                    flat 
                    className="submit-button" 
                    onClick={this.onDoneButtonPressed}
                    disabled={this.state.selectedRowIndex === undefined}
                >
                    Done
                </Button>
            </div>
        );
    }

    private onRowSelected(rowIndex: number, checked: boolean) {
        // As rowIndex starts from 1, we are decreasing 1 in order to get 0-based index
        let zeroBasedSelecteRowIndex = rowIndex - 1;

        // In case the same row was selected - meaning the user wanted the remove the selection
        if (this.state.selectedRowIndex === zeroBasedSelecteRowIndex) {
            this.setState({ selectedRowIndex: undefined });

            return;
        }

        this.setState({ selectedRowIndex: zeroBasedSelecteRowIndex });
    }

    private onDoneButtonPressed(): void {
        if (this.state.selectedRowIndex === undefined) {
            throw new Error('You must signal before pressing the done button');
        }

        // Get the selected signal
        let selectedSignal = this.props.signals[this.state.selectedRowIndex];

        this.props.onDoneButtonPressed(selectedSignal);
    }
}