// -----------------------------------------------------------------------
// <copyright file="index.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import DataTable from '../../models/DataTable';
import TimelineChart from '../../models/Charts/TimelineChart';
import Column from '../../models/Column';

export default function timelineDataFormat(dataTable: DataTable): TimelineChart  {
        // Get all the columns that are timestamp
        let timestampColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'datetime');

        if (timestampColumns.length !== 1) {
            throw new Error('There must be exact one timestamp column');
        }

        // Get all the columns which are strings
        let stringColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'string');

        // Get all the columns which are numeric values
        let numericColumns: Column[] = dataTable.columnsMetadata.filter(column => column.dataType === 'int' ||
                                                                                  column.dataType === 'long');

        // Sort the rows by timestamp
        dataTable.data.sort((a, b) => { return +new Date(a[timestampColumns[0].name]) - 
                                               +new Date(b[timestampColumns[0].name]);
                                      });

        return {
            data: dataTable.data,
            timestampColumnName: timestampColumns[0].name,
            lines: stringColumns.map(column => column.name),
            numericFields: numericColumns.map(column => column.name)
        };
}