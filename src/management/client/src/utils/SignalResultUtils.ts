// -----------------------------------------------------------------------
// <copyright file="SignalResultUtils.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import SignalResultProperty, { PropertyCategory } from '../models/SignalResultProperty';
import SignalResult from '../models/SignalResult';

/**
 * A utility class for SignalResult object
 */
export class SignalResultUtils {
    /**
     * The regex pattern for Azure resource path
     */
    private static resourceRegex = new RegExp('\/subscriptions\/(.*)\/resourceGroups\/(.*)\/providers\/.*\/.*\/(.*)');

    /**
     * Gets the resource name from the given resource id
     * @param resourceId The resource id
     */
    public static getResourceName(resourceId: string): string {
        let regexResults = this.getResourceIdRegexResults(resourceId);

        // Group 3 is the resource name
        return regexResults[3];
    }

    /**
     * Gets the subscription id from the given resource id
     * @param resourceId The resource id
     */
    public static getSubscriptionId(resourceId: string): string {
        let regexResults = this.getResourceIdRegexResults(resourceId);
 
        // Group 1 is the subscription id
        return regexResults[1];
     }

    /**
     * Gets the resouce group name from the given resource id
     * @param resourceId The resource id
     */
    public static getResourceGroup(resourceId: string): string {
        let regexResults = this.getResourceIdRegexResults(resourceId);
 
        // Group 1 is the subscription id
        return regexResults[2];
     }

     /**
      * Gets all the analysis properties from the given signal result
      * @param signalResult The signal result
      */
     public static getAllAnalysisProperties(signalResult: SignalResult): SignalResultProperty[] {
         return signalResult.properties.filter(property => property.displayCategory === PropertyCategory.Analysis);
     }

    /**
     * Gets all the charts properties from the given signal result
     * @param signalResult The signal result
     */
    public static getAllChartProperties(signalResult: SignalResult): SignalResultProperty[] {
        return signalResult.properties.filter(property => property.displayCategory === PropertyCategory.Chart);
    }

     /**
      * Check if the given resource id is valid and return the regex results
      * @param resourceId The resource id
      */
     private static getResourceIdRegexResults(resourceId: string): RegExpExecArray {
        if (!this.resourceRegex.test(resourceId)) {
            throw new Error('Given resource id is not valid');
        }

        let regexResults = this.resourceRegex.exec(resourceId);
 
        if (regexResults == null) {
            throw new Error('Given resource id is not valid');
        }

        return regexResults;
     }
}