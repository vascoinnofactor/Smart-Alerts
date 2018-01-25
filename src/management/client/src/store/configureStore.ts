// -----------------------------------------------------------------------
// <copyright file="configureStore.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';

const configure =
  process.env.NODE_ENV === 'production'
    ? configureStoreProd
    : configureStoreDev;

export default configure;