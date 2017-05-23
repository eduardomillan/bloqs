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
 * Description: It turns on the buzzer of FreaksCar with a basic note,
 *              selectable from a drop-down, during a given period of time.
 *
 * Return type: none
 */

var freakscarBuzzer = _.merge(_.clone(StatementBloq, true), {

    name: 'freakscarBuzzer',
    bloqClass: 'bloq-freakscar-color',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-buzzer'
        }, {
            id: 'NOTE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-evolution-buzzer-do',
                value: 'note_C4'
            }, {
                label: 'bloq-evolution-buzzer-re',
                value: 'note_D4'
            }, {
                label: 'bloq-evolution-buzzer-mi',
                value: 'note_E4'
            }, {
                label: 'bloq-evolution-buzzer-fa',
                value: 'note_F4'
            }, {
                label: 'bloq-evolution-buzzer-sol',
                value: 'note_G4'
            }, {
                label: 'bloq-evolution-buzzer-la',
                value: 'note_A4'
            }, {
                label: 'bloq-evolution-buzzer-si',
                value: 'note_B4'
            }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-buzzer-for'
        }, {
            id: 'SECONDS',
            alias: 'numberInput',
            value: 1000
        }, {
            alias: 'text',
            value: 'bloq-evolution-buzzer-ms'
        }]
    ],
    code: 'robot.playTone({NOTE},{SECONDS});',
    arduino: {
        includes: ['BitbloqFreaksCar.h', 'BitbloqUS.h'],
        needInstanceOf: [{
            name: 'robot',
            type: 'BitbloqFreaksCar'
        }],
        setupExtraCode: 'robot.init();',
        code: 'robot.playTone({NOTE},{SECONDS});'
    }
});
utils.preprocessBloq(freakscarBuzzer);

module.exports = freakscarBuzzer;
