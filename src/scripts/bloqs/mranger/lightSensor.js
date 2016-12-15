/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mRangerGetLightSensor
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mRangerGetLightSensor = _.merge(_.clone(OutputBloq, true), {

    name: 'mRangerGetLightSensor',
    bloqClass: 'bloq-mranger-getlightsensor',
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
        includes: ['BitbloqMRanger.h'],
        needInstanceOf: [{
            name: 'mRanger',
            type: 'MRanger'
        }],
        code: 'mRanger.getLightSensor()'
    }
});

utils.preprocessBloq(mRangerGetLightSensor);

module.exports = mRangerGetLightSensor;