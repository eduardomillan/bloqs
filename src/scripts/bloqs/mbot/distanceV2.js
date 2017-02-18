/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mBotGetDistance
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mBotGetDistance = _.merge(_.clone(OutputBloq, true), {

    name: 'mBotGetDistance-v2',
    bloqClass: 'bloq-mbot-getdistance',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mbot-getdistance'
        }, {
            id: 'ULTRASONIC',
            alias: 'dynamicDropdown',
            options: 'mkb_ultrasonic'
        }]
    ],
    code: '',
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino: {
        includes: ['BitbloqUS.h', 'BitbloqMBot.h'],
        needInstanceOf: [{
            name: '{ULTRASONIC}',
            type: 'US'
        }, {
            name: 'mBot',
            type: 'BitbloqMBot'
        }],
        setupCodeAtTheEndOfExtraCode: 'mBot.setup();',
        setupExtraCode: '{ULTRASONIC} = new US(mBot.getPinFromPort(º[{ULTRASONIC}.pin.s],2),mBot.getPinFromPort(º[{ULTRASONIC}.pin.s],2));',
        code: '{ULTRASONIC}.read()'
    }
});
utils.preprocessBloq(mBotGetDistance);

module.exports = mBotGetDistance;