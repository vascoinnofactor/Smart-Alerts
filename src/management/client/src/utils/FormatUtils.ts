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
}