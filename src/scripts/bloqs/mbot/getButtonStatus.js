/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mBotGetButtonStatus
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mBotGetButtonStatus = _.merge(_.clone(OutputBloq, true), {

    name: 'mBotGetButtonStatus',
    bloqClass: 'bloq-mbot-getbuttonstatus',
    content: [
        [{
            alias: 'text',
            value: 'Leer estado del botón'
        }]
    ],
    code: '',
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino: {
        includes: ['mBot.h'],
        needInstanceOf: [{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.getButtonStatus()'
    }
});

utils.generateBloqInputConnectors(mBotGetButtonStatus);

module.exports = mBotGetButtonStatus;