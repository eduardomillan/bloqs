/*global require */
'use strict';

var _ = require('lodash');
var OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'turnOnOffAdvanced',
    bloqClass: 'bloq-turn-on-off-advanced',
    content: [
        [{
            id: 'VALUE',
            alias: 'staticDropdown',
            options: [{
                label: 'Encender',
                value: 'HIGH'
            }, {
                label: 'Apagar',
                value: 'LOW'
            }]
        }]
    ],
    code: '{VALUE}'
});

module.exports = bloq;
