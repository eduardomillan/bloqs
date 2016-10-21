/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mBotGetLightSensor
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mBotGetLightSensor = _.merge(_.clone(OutputBloq, true), {

    name: 'mBotGetLightSensor',
    bloqClass: 'bloq-mbot-getlightsensor',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mbot-getlightsensor'
        }]
    ],
    code: '',
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino: {
        includes: ['BitbloqMBot.h'],
        needInstanceOf: [{
            name: 'mBot',
            type: 'MBot'
        }],
        code: 'mBot.getLightSensor()'
    }
});

utils.generateBloqInputConnectors(mBotGetLightSensor);

module.exports = mBotGetLightSensor;