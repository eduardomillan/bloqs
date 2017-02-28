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
            value: 'Si se detecta un obstaculo a poca distancia con '
        }, {
            id: 'ULTRASOUND',
            alias: 'dynamicDropdown',
            options: 'mkb_ultrasound'
        }]
    ],
    code: '',
    arduino: {
        code: 'if({ULTRASOUND}.readDistanceInCM() < 5){{STATEMENTS}}'
    }
});

utils.preprocessBloq(bloqMBotSomethingNear);
bloqMBotSomethingNear.connectors[1].acceptedAliases = ['all', 'ifDown'];


module.exports = bloqMBotSomethingNear;