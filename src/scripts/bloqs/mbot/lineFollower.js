/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: mBotLineFollower
 *
 * Bloq type: Output
 *
 *
 *
 * Return type: float
 */

var mBotLineFollower = _.merge(_.clone(OutputBloq, true), {

    name: 'mBotLineFollower',
    bloqClass: 'bloq-mbot-linefollower',
    content: [
        [{
            alias: 'text',
            value: 'Obtener la información del siguelineas en el '
        }, {
            id: 'PORT',
            alias: 'staticDropdown',
            options: [{
                label: 'puerto 1',
                value: '1'
            }, {
                label: 'puerto 2',
                value: '2'
            }, {
                label: 'puerto 3',
                value: '3'
            }, {
                label: 'puerto 4',
                value: '4'
            }]
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
        code: 'mBot.getLineFollower({PORT})'
    }
});
utils.generateBloqInputConnectors(mBotLineFollower);

module.exports = mBotLineFollower;