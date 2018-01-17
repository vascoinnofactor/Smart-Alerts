// -----------------------------------------------------------------------
// <copyright file="QueryResults.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * This model represents the query results (coming from Application Insights)
 */
interface QueryResults {
    Tables: QueryResult[];
}
  
/**
 * This model represents a query result (coming from Application Insights)
 */
interface QueryResult {
    tableName: string;

    columns: {
      columnName: string,
      dataType: string,
      columnType: string
    }[];

    // As Application Insights/OMS response is dynamic, we must use 'any'
    // tslint:disable-next-line:no-any
    rows: any[][];
}

export {
    QueryResults,
    QueryResult
};