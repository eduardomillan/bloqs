//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: oscillatorsST
 *
 * Bloq type: Statement-Input
 *
 * Description: 
 *
 * Return type: none
 */

var oscillatorsST = _.merge(_.clone(StatementInputBloq, true), {

    name: 'oscillatorsST',
    bloqClass: 'bloq-oscillators-ST',
    content: [
        [{
            alias: 'text',
            value: 'Oscilar '
        }, {
            id: 'TIMES',
            alias: 'numberInput',
            value: 4
        }, {
            alias: 'text',
            value: 'veces con un período de'
        }, {
            id: 'PERIOD',
            alias: 'numberInput',
            value: 1000
        }, {
            alias: 'text',
            value: 'ms los siguientes servos:'
        }]
    ],
    code: ''
});

utils.generateBloqInputConnectors(oscillatorsST);

module.exports = oscillatorsST;