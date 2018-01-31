'use strict';

const config  = require('./deploymentConfig');
const gulp    = require('gulp');
const program = require('commander');

program
    .allowUnknownOption()
    .option(
        '-d, --dest <type>',
        `Specifies the build destination path. (Current = ${ config.DEST_PACKAGE_FILE })`
    )
    .parse(process.argv);

// Set the destination path to be a global variable
process.env.DEST_PACKAGE_FILE = program.dest || config.DEST_PACKAGE_FILE;

require('./scripts/pack')(gulp);