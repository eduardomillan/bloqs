/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: freakscarBuzzer
 *
 * Bloq type: Statement
 *
 * Description: It turns on the buzzer of FreaksCar with a frequency,
 *             git during a given period of time.
 *
 * Return type: none
 */

var freakscarBuzzer = _.merge(_.clone(StatementBloq, true), {

    name: 'freakscarBuzzer',
    bloqClass: 'bloq-freakscar-color',
    content: [
        [{
                alias: 'text',
                value: 'bloq-freakscar-buzzer'
            }, {
                id: 'FREQUENCY',
                alias: 'numberInput',
                value: 261
            },
            {
                alias: 'text',
                value: 'bloq-evolution-buzzer-for'
            },
            {
                id: 'SECONDS',
                alias: 'numberInput',
                value: 1000
            },
            {
                alias: 'text',
                value: 'bloq-evolution-buzzer-ms'
            }
        ]
    ],
    code: 'robot.playTone({FREQUENCY},{SECONDS});',
    arduino: {
        includes: ['BitbloqFreaksCar.h', 'BitbloqUS.h'],
        needInstanceOf: [{
            name: 'robot',
            type: 'BitbloqFreaksCar'
        }],
        setupExtraCode: 'robot.setup();',
        code: 'robot.playTone({FREQUENCY},{SECONDS});'
    }
});
utils.preprocessBloq(freakscarBuzzer);

module.exports = freakscarBuzzer;
