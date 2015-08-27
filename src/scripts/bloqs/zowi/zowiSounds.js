/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiSounds',
    bloqClass: 'bloq-zowi-sounds',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-sounds'
        }, {
            id: 'SOUND',
            alias: 'staticDropdown',
            options: [{
                label: 'sound1',
                value: 'sound1'
            }, {
                label: 'sound2',
                value: 'sound2'
            }]
        }]
    ],
    code: 'TODO'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;