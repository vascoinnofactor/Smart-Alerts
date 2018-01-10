// -----------------------------------------------------------------------
// <copyright file="DateUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Moment } from 'moment';

/**
 * A utility class for Date functions
 */
export class DateUtils {
    /**
     * Get a string representation that shows the range of the start time to end time.
     * E.g. 4/14 21:49 PM - 4/15 21:49 PM
     * @param startTime The start time.
     * @param endtime The end time (optional).
     */
    public static getStartTimeAndEndTimeAsRange(startTime: Moment, endtime?: Moment): string {
        let result: string = '';

        result += startTime.format('M/D HH:mm A');

        if (endtime) {
            if (endtime.isSame(startTime, 'day')) {
                result += ' - ' + endtime.format('HH:mm A');
            } else {
                result += ' - ' + endtime.format('M/D HH:mm A');
            }
        }

        return result;
    }
}