/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorStopAdvanced',
    bloqClass: 'bloq-oscillator-stop-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-oscillator-stop-advanced-stop'
        }, {
            bloqInputId: 'OSCILLATOR',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{OSCILLATOR}.stop()'

});
utils.generateBloqInputConnectors(bloq);

module.exports = bloq;