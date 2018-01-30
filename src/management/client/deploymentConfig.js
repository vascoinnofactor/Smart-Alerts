'use strict';

const { platform } = require('os');
const { join }     = require('path');

const SRC_WEB_DIR       = join(__dirname, 'build/');
const DEST_PACKAGE_FILE = join(SRC_WEB_DIR, 'packages/web.zip');

const MSDEPLOY_BIN_FILE = platform() === 'win32' && join(process.env['ProgramFiles(x86)'] || process.env.ProgramFiles, 'IIS\\Microsoft Web Deploy V3\\msdeploy.exe');

const MSDEPLOY_IIS_PARAMETERS = {
    defaultValue: 'Default Web Site',
    kind:         'ProviderPath',
    name:         'IIS Web Application Name',
    scope:        'IisApp',
    tags:         'IisApp'
};

module.exports = {
    SRC_WEB_DIR,
    DEST_PACKAGE_FILE,

    MSDEPLOY_BIN_FILE,
    MSDEPLOY_IIS_PARAMETERS
};