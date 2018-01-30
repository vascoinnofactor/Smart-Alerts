'use strict';

const config       = require('../deploymentConfig');
const ChildProcess = require('child_process');
const fs           = require('fs');
const os           = require('os');
const path         = require('path');
const Promise      = require('bluebird');

const { formatIISParameters, log, prettyPath } = require('./utils');

const exec   = Promise.promisify(ChildProcess.exec);
const mkdirp = Promise.promisify(require('mkdirp'));
const stat   = Promise.promisify(fs.stat);

module.exports = function (gulp) {
    gulp.task('pack', ['pack:iisapp']);
    gulp.task('pack:prepare', packPrepare);
    gulp.task('pack:iisapp', ['pack:prepare'], packIISApp);

    function packPrepare() {
        return Promise.all([
        mkdirp(path.dirname(process.env.DEST_PACKAGE_FILE))
            .catch(err => {
                log('pack:prepare', `Failed to create output directory at ${ prettyPath(process.env.DEST_PACKAGE_FILE) }`);
                return Promise.reject(err);
            }),
        stat(config.SRC_WEB_DIR)
            .catch(err => {
                log('pack:prepare', `No files were found to pack at ${ prettyPath(config.SRC_WEB_DIR) }, please run "npm run build" first.`)
                return Promise.reject(err);
            }),
        stat(config.MSDEPLOY_BIN_FILE)
            .catch(err => {
                log('pack:prepare', `MSDeploy not found at ${ prettyPath(config.MSDEPLOY_BIN_FILE) }`);
                return Promise.reject(err);
            })
        ]);
    }

    function runMSDeploy(src, dest) {
        if (os.platform() !== 'win32') {
            return Promise.reject(new Error('MSDeploy is only supported on Windows platform'));
        }

        return (
            exec([
                `"${ config.MSDEPLOY_BIN_FILE }"`,
                '-verb:sync',
                `-source:iisApp=${ src }`,
                `-dest:package=${ dest }`,
                `-declareParam:${ formatIISParameters(config.MSDEPLOY_IIS_PARAMETERS) }`
            ].join(' '), {
                maxBuffer: 10485760
            })
        );
    }

    function packIISApp() {
        console.log(`src: ${config.SRC_WEB_DIR} dest: ${process.env.DEST_PACKAGE_FILE}`);
        log('pack:iisapp', `Packing from ${ prettyPath(config.SRC_WEB_DIR) } to ${ prettyPath(process.env.DEST_PACKAGE_FILE) }`);

        return runMSDeploy(config.SRC_WEB_DIR, process.env.DEST_PACKAGE_FILE);
    }
};