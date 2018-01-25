// -----------------------------------------------------------------------
// <copyright file="SignalResult.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';

import SignalResultSummaryProperty from './SignalResultSummaryProperty';
import SignalResultProperty from './SignalResultProperty';
import QueryRunInfo from './QueryRunInfo';

/**
 * This model represents the signal result entity
 */
export default interface SignalResult {
    /**
     * Gets the signal result id
     */
    id: string;

    /**
     * Gets the signal result title
     */
    title: string;

    /**
     * Gets the signal result summary
     */
    summary: SignalResultSummaryProperty;

    /**
     * Gets the signal result resource id
     */
    resourceId: string;

    /**
     * Gets the signal result correlation hash
     */
    correlationHash: string;

    /**
     * Gets the signal id related to this signal result
     */
    signalId: string;

    /**
     * Gets the signal name related to this signal result
     */
    signalName: string;

    /**
     * Gets the signal result end time of the analysis window
     */
    analysisTimestamp: Moment;

    /**
     * Gets the signal result analysis window size (in minutes)
     */
    analysisWindowSizeInMinutes: number;

    /**
     * Gets the signal result properties
     */
    properties: ReadonlyArray<SignalResultProperty>;

    /**
     * Gets the raw signal result properties
     */
    rawProperties: Map<string, string>;

    /**
     * Gets the signal result queries run info
     */
    queryRunInfo: QueryRunInfo;
}