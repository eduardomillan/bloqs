/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: botbloqHumanRotateByFoot
 *
 * Bloq type: Statement
 *
 * Description: Move the human
 *
 */

var botbloqHumanRotateByFoot = _.merge(_.clone(StatementBloq, true), {

    name: 'botbloqHumanRotateByFoot',
    bloqClass: 'bloq-botbloq-human-rotatefoot',
    content: [
        [{
            alias: 'text',
            value: 'Rotar'
        }, {
            id: 'DEGREES',
            alias: 'numberInput',
            value: 45
        }, {
            alias: 'text',
            value: '° sobre el pie'
        }, {
            id: 'FOOT',
            alias: 'staticDropdown',
            options: [{
                label: 'derecho',
                value: 'RIGHT'
            }, {
                label: 'izquierdo',
                value: 'LEFT'
            }]
        }]
    ],
    code: '',
    python: {
        libraries: ['BotbloqHuman'],
        needInstanceOf: [{
            name: 'human',
            type: 'BotbloqHuman'
        }],
        codeLines: [{
            code: 'human.rotateByFoot({DEGREES},"{FOOT}")'
        }]
    }
});

utils.preprocessBloq(botbloqHumanRotateByFoot);

module.exports = botbloqHumanRotateByFoot;