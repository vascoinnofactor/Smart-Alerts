// -----------------------------------------------------------------------
// <copyright file="FormatUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * A utils class that responsible for values formating.
 */
export default class FormatUtils {
  /**
   * Convert from long number to a short presentation.
   * E.g. 1000 -> 1K.
   * @param value The numeric value.
   * @param postfix The post fix (optional).
   */
  static kmNumber(value: number, postfix?: string): string {
      return (
        value > 999999999 ?
        (value / 1000000000).toFixed(1) + 'B' :
          value > 999999 ?
            (value / 1000000).toFixed(1) + 'M' :
            value > 999 ?
              (value / 1000).toFixed(1) + 'K' : 
                (value % 1 * 10) !== 0 ?
                value.toFixed(1).toString() : value.toString()) + (postfix || '');
  }

  /**
   * Convert from minutes to string presentation.
   * E.g. 1440 -> Every 1 day
   *      10   -> Every 10 minutes
   *      60   -> Every 1 hour
   *      70   -> Every 1 hour and 10 minutes
   * @param numberOfMinutes The number of minutes
   */
  static minutesToStringPresentation(numberOfMinutes: number) {
    if (numberOfMinutes < 60) {
        return `Every ${numberOfMinutes} minutes`;
    }

    let numberOfDays = Math.floor(numberOfMinutes / 1440);
    let numberOfHours = (numberOfMinutes - (numberOfDays * 1440)) / 60;
    let numberOfMinutesLeft = numberOfMinutes % 60;

    let timePresentation: string = 'Every ';
    if (numberOfDays > 0) {
        timePresentation += `${numberOfDays} days`;
    }

    if (numberOfHours > 0) {
        if (numberOfDays > 0) {
            timePresentation += 'and ';
        }

        timePresentation += `${numberOfHours} hours`;
    }

    if (numberOfMinutesLeft > 0) {
        if (numberOfDays > 0 || numberOfHours > 0) {
            timePresentation += 'and ';
        }

        timePresentation += `${numberOfMinutesLeft} minutes`;
    }

    return timePresentation;
  }
}