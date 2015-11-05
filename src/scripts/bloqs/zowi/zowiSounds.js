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
                label: 'bloq-zowi-sounds-surprise',
                value: 'S_surprise'
            }, {
                label: 'bloq-zowi-sounds-OhOoh',
                value: 'S_OhOoh'
            }, {
                label: 'bloq-zowi-sounds-cuddly',
                value: 'S_cuddly'
            }, {
                label: 'bloq-zowi-sounds-sleeping',
                value: 'S_sleeping'
            }, {
                label: 'bloq-zowi-sounds-happy',
                value: 'S_happy'
            }, {
                label: 'bloq-zowi-sounds-sad',
                value: 'S_sad'
            }, {
                label: 'bloq-zowi-sounds-confused',
                value: 'S_confused'
            }, {
                label: 'bloq-zowi-sounds-fart1',
                value: 'S_fart1'
            }]
        }]
    ],
    code: 'zowi.sing({SOUND});'
});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;