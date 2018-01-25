// -----------------------------------------------------------------------
// <copyright file="SignalResultSummaryProperty.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import SignalResultProperty from './SignalResultProperty';

/**
 * This model represents a signal result summary property
 */
export default interface SignalResultSummaryProperty {
    /**
     * Gets the signal result summary value.
     */
    value: string;

    /**
     * Gets the signal result summary details.
     */
    details: string;

    /**
     * Gets the signal result summary chart.
     */
    chart: SignalResultProperty;
}