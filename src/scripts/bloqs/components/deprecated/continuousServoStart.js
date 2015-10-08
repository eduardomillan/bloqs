/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    StatementBloq = require('./../../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'continuousServoStartAdvanced',
    bloqClass: 'bloq-continuous-servo-start-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-continuous-servo-start-advanced-turn'
        }, {
            bloqInputId: 'SERVO',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-continuous-servo-start-advanced-direction'
        }, {
            id: 'DIRECTION',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-continuous-servo-start-advanced-clockwise',
                value: '0'
            }, {
                label: 'bloq-continuous-servo-start-advanced-counterclockwise',
                value: '180'
            }]
        }]
    ],
    code: '{SERVO}.write({DIRECTION});'
});

utils.generateBloqInputConnectors(bloq);


module.exports = bloq;



