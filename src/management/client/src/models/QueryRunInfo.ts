// -----------------------------------------------------------------------
// <copyright file="QueryRunInfo.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { DataSource } from '../enums/DataSource';

/**
 * This model represents the query run info for the signal result
 */
export default interface QueryRunInfo {
    /**
     * Gets the data source where the queries should run against
     */
    type: DataSource;

    /**
     * Gets the resources the queries should run against
     */
    resourceIds: string[];
}