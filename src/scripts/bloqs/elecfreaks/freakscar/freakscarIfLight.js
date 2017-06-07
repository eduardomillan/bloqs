/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: evolutionIfLight
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if Evolution detects
 *              black or white, selectable from two drop-downs, in both
 *              light follower sensors.
 *
 * Return type: none
 */

var freakscarIfLight = _.merge(_.clone(StatementInputBloq, true), {

    name: 'freakscarIfLight',
    bloqClass: 'bloq-freakscar-color',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-if-light'
        }, {
            id: 'RANGELEFT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-evolution-if-light-high',
                value: 'HIGH_LIGHT'
            }, {
                label: 'bloq-evolution-if-light-medium',
                value: 'MEDIUM_LIGHT'
            }, {
                label: 'bloq-evolution-if-light-low',
                value: 'LOW_LIGHT'
            }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-if-light-and'
        }, {
            id: 'RANGERIGHT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-evolution-if-light-high',
                value: 'HIGH_LIGHT'
            }, {
                label: 'bloq-evolution-if-light-medium',
                value: 'MEDIUM_LIGHT'
            }, {
                label: 'bloq-evolution-if-light-low',
                value: 'LOW_LIGHT'
            }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-if-light-then'
        }]
    ],
    code: '',
    arduino: {
        includes: ['BitbloqFreaksCar.h'],
        needInstanceOf: [{
            name: 'robot',
            type: 'BitbloqFreaksCar'
        }],
        setupExtraCode: 'robot.setup();',
        code: 'if(robot.getLightRange(LEFT,{RANGELEFT}) && robot.getLightRange(RIGHT,{RANGERIGHT})){{STATEMENTS}}'
    }
});

freakscarIfLight.connectors[1].acceptedAliases = ['all', 'ifDown'];

utils.preprocessBloq(freakscarIfLight);

module.exports = freakscarIfLight;
