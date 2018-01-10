// -----------------------------------------------------------------------
// <copyright file="SignalResult.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';

import Property from './SignalResultProperty';
import ChartType from './ChartType';

export default class SignalResult {
    /**
     * Gets the insight id
     */
    public id: string;

    /**
     * Gets the signal title
     */
    public title: string;

    /**
     * Gets the insight name
     */
    public name: string;

    /**
     * Gets the insight start time timestamp (Mandatory)
     */
    public startTime: Moment;

    /**
     * Gets the insight end time timestamp (Not mandatory)
     */
    public endTime: Moment;

    /**
     * Gets the insight's subscription id
     */
    public subscriptionId?: string;

    /**
     * Gets the insight's resource group
     */
    public resourceGroup?: string;

    /**
     * Gets the insights's resource name
     */
    public resourceName: string;

    /**
     * Gets the signal chart property
     */
    public chartProperty: Property;
    
    /**
     * Gets the signal chart data
     */
    public chartData?: { time: string, number: number }[];

    /**
     * Gets the signal chart type
     */
    public chartType?: ChartType;

    /**
     * Gets the summary part properties 
     */
    public summaryProperty: Property;

    /**
     * Gets the analysis part properties
     */
    public analysisProperties?: Property[];

    /**
     * Initializes a new instance of the SignalResult class
     * @param name The signal result name.
     * @param title The signal result title.
     * @param resourceName The signal result resource name.
     * @param startTime The signal result start time.
     * @param endTime The signal result end time.
     * @param chartProperty The signal result chart property.
     * @param summaryProperty The signal result summary property.
     * @param subscriptionId The signal result subscription id.
     * @param resourceGroup The signal result resource group.
     * @param analysisProperties The signal result analysis properties.
     * @param chartData The signal result chart data.
     * @param chartType The signal result chart type.
     */
    public constructor(name: string, title: string, resourceName: string, 
                       startTime: Moment, endTime: Moment, chartProperty: Property,
                       summaryProperty: Property, subscriptionId?: string, resourceGroup?: string,
                       analysisProperties?: Property[], chartData?: { time: string, number: number }[],
                       chartType?: ChartType) {
        this.name = name;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.resourceName = resourceName;
        this.subscriptionId = subscriptionId;
        this.resourceGroup = resourceGroup;
        this.summaryProperty = summaryProperty;
        this.analysisProperties = analysisProperties;
        this.chartProperty = chartProperty;
        this.chartData = chartData;
        this.chartType = chartType;
    }
}