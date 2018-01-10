// -----------------------------------------------------------------------
// <copyright file="baseUrl.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import baseUrlDev from './baseUrl.dev';
import baseUrlProd from './baseUrl.prod';

// Check which API url we should go by checking the environment name
const baseUrl = process.env.NODE_ENV === 'production' ? baseUrlProd : baseUrlDev;

export default baseUrl;