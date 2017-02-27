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

    name: 'mBotGetLightSensor-v2',
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
            type: 'BitbloqMBot'
        }],
        code: 'mBot.readLightSensor()'
    }
});

utils.preprocessBloq(mBotGetLightSensor);

module.exports = mBotGetLightSensor;