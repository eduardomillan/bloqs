/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: mbot-ifthereisalotoflight
 *
 * Bloq type: Statement-Input
 *
 * Description:
 *
 * Return type: none
 */

var bloqMBotIfFollowLines = _.merge(_.clone(StatementInputBloq, true), {

    name: 'mBotIfFollowLines',
    bloqClass: 'bloq-mbot-iffollowlines',
    content: [
        [{
            alias: 'text',
            value: 'bloq-mbot-iffollowlines-if' //si detecta línea
        }, {
            id: 'LINELEFT',
            alias: 'staticDropdown',
            options: [{
                label: 'white',
                value: 1
            }, {
                label: 'black',
                value: 0
            }]
        }, {
            alias: 'text',
            value: 'bloq-mbot-iffollowlines-and' //en el sensor izquierdo y línea
        }, {
            id: 'LINERIGHT',
            alias: 'staticDropdown',
            options: [{
                label: 'white',
                value: 1
            }, {
                label: 'black',
                value: 0
            }]
        }, {
            alias: 'text',
            value: 'bloq-mbot-iffollowlines-withsensor' //en el sensor derecho del
        }, {
            id: 'LINEFOLLOWER',
            alias: 'dynamicDropdown',
            options: 'mkb_linefollower'
        }]
    ],
    code: '',
    arduino: {
        code: 'if((digitalRead({LINEFOLLOWER}_1) == {LINELEFT}) && (digitalRead({LINEFOLLOWER}_2) == {LINERIGHT})){{STATEMENTS}}'
    }
});

utils.preprocessBloq(bloqMBotIfFollowLines);
bloqMBotIfFollowLines.connectors[1].acceptedAliases = ['all', 'ifDown'];


module.exports = bloqMBotIfFollowLines;