//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: analogWriteV1
 * 
 * Bloq type: Statement
 *
 * Description: It sets a specific PWM pin with a given value.
 * 
 * Return type: none
 */

var analogWriteV1 = _.merge(_.clone(StatementBloq, true), {

    name: 'analogWrite-V1',
    bloqClass: 'bloq-analog-write-V1',
    content: [
        [{
            alias: 'text',
            value: 'bloq-pin-analog-write-V1'
        }, {
            id: 'PIN',
            alias: 'staticDropdown',
            options: [{
                label: '3',
                value: '3'
            }, {
                label: '5',
                value: '5'
            }, {
                label: '6',
                value: '6'
            }, {
                label: '9',
                value: '9'
            }, {
                label: '10',
                value: '10'
            }, {
                label: '11',
                value: '11'
            }]
        }, {
            alias: 'text',
            value: 'bloq-pin-analog-write-value-V1'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'analogWrite({PIN},{VALUE});',
});

utils.generateBloqInputConnectors(analogWriteV1);


module.exports = analogWriteV1;