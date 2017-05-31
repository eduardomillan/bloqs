/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../build-utils'),
    StatementInputBloq = require('./../../../statementInputBloq');

/**
 * Bloq name: mbot-ifthereisalotoflight
 *
 * Bloq type: Statement-Input
 *
 * Description:
 *
 * Return type: none
 */

var remoteButtonPushed = _.merge(_.clone(StatementInputBloq, true), {

    name: 'remoteButtonPushed',
    bloqClass: 'bloq-mbot-color',
    content: [
        [{
            alias: 'text',
            value: 'if-button-pressed'
        }, {
            id: 'BUTTON',
            alias: 'staticDropdown',
            options: [{
                    label: 'key-on-off',
                    value: '"P"'
                },
                {
                    label: 'menu',
                    value: '"M"'
                },
                {
                    label: '+',
                    value: '"+"'
                },
                {
                    label: '-',
                    value: '"-"'
                },
                {
                    label: 'key-return',
                    value: '"R"'
                }, {
                    label: 'key-arrow-up',
                    value: '"F"'
                }, {
                    label: 'key-arrow-down',
                    value: '"B"'
                }, {
                    label: 'key-arrow-right',
                    value: '"R"'
                }, {
                    label: 'key-arrow-left',
                    value: '"L"'
                },
                {
                    label: '0',
                    value: '"0"'
                }, {
                    label: '1',
                    value: '"1"'
                }, {
                    label: '2',
                    value: '"2"'
                },
                {
                    label: '3',
                    value: '"3"'
                },
                {
                    label: '4',
                    value: '"4"'
                }, {
                    label: '5',
                    value: '"5"'
                }, {
                    label: '6',
                    value: '"6"'
                },
                {
                    label: '7',
                    value: '"7"'
                },
                {
                    label: '8',
                    value: '"8"'
                },
                {
                    label: '9',
                    value: '"9"'
                }
            ]
        }, {
            alias: 'text',
            value: 'in'
        }, {
            id: 'REMOTE',
            alias: 'dynamicDropdown',
            options: 'remoteControl'
        }]
    ],
    code: '',
    arduino: {
        code: 'if(¬{REMOTE.readSensor} == {BUTTON}){{STATEMENTS}}'
    }
});

utils.preprocessBloq(remoteButtonPushed);
remoteButtonPushed.connectors[1].acceptedAliases = ['all', 'ifDown'];


module.exports = remoteButtonPushed;
