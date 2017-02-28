/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: mbot-SomethingNear
 *
 * Bloq type: Statement-Input
 *
 * Description:
 *
 * Return type: none
 */

var bloqMBotSomethingNear = _.merge(_.clone(StatementInputBloq, true), {

    name: 'mBotSomethingNear',
    bloqClass: 'bloq-mbot-somethingnear',
    content: [
        [{
            alias: 'text',
            value: 'Si'
        }, {
            id: 'OPERATION',
            alias: 'staticDropdown',
            options: [{
                label: 'se detecta un obstáculo a poca distancia',
                value: '{ULTRASOUND}.readDistanceInCM() < 8'
            }, {
                label: 'se detecta un obstáculo a mucha distancia',
                value: '({ULTRASOUND}.readDistanceInCM() >= 8) && ({ULTRASOUND}.readDistanceInCM() < 513)'
            }, {
                label: 'no se detecta un obstáculo',
                value: '{ULTRASOUND}.readDistanceInCM() >= 513'
            }]
        }, {
            alias: 'text',
            value: 'con el '
        }, {
            id: 'ULTRASOUND',
            alias: 'dynamicDropdown',
            options: 'mkb_ultrasound'
        }]
    ],
    code: '',
    arduino: {
        code: 'if({OPERATION}){{STATEMENTS}}'
    }
});

utils.preprocessBloq(bloqMBotSomethingNear);
bloqMBotSomethingNear.connectors[1].acceptedAliases = ['all', 'ifDown'];


module.exports = bloqMBotSomethingNear;