/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../build-utils'),
    OutputBloq = require('./../../../outputBloq');

/**
 * Bloq name: evolutionDistance
 *
 * Bloq type: Output
 *
 * Description: It returns the distance measurement that Evolution sees.
 *
 * Return type: float
 */

var freakscarRemote = _.merge(_.clone(OutputBloq, true), {

    name: 'freakscarRemote',
    bloqClass: 'bloq-freakscar-color',
    content: [
        [{
            alias: 'text',
            value: 'bloq-freakscar-read-remote'
        }]
    ],
    code: '',
    returnType: {
        type: 'simple',
        value: 'char'
    },
    arduino: {
        includes: ['BitbloqIRControl.h'],
        code: 'robot.getInfraredControlCommand()'
    }
});
utils.preprocessBloq(freakscarRemote);

module.exports = freakscarRemote;
