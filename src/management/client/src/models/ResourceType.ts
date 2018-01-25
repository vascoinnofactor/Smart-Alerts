// -----------------------------------------------------------------------
// <copyright file="ResourceType.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/**
 * List all the possible supported resource types
 */
export enum ResourceType {
    /**
     * The Subscription resource type.
     */
    Subscription,

    /**
     * The Resource Group resource type.
     */
    ResourceGroup,

    /**
     * The Virtual Machine resource type.
     */
    VirtualMachine,

    /**
     * The Application Instance resource type.
     */
    ApplicationInsights,

    /**
     * The log analytics workspace resource type.
     */
    LogAnalytics
}

export default ResourceType;