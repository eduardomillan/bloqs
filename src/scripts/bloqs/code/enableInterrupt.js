/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'enableInterrupt',
    bloqClass: 'bloq-enable-interrupt',
    content: [
        [{
            alias: 'text',
            value: 'bloq-enable-interrupt'
        }, {
            id: 'FUNC',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }, {
            alias: 'text',
            value: 'bloq-enable-interrupt-pin'
        }, {
            id: 'PIN',
            alias: 'dynamicDropdown',
            options: 'varComponents'
        }, {

            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-enable-interrupt-rising',
                    value: 'RISING'
                }, {
                    label: 'bloq-enable-interrupt-falling',
                    value: 'FALLING'
                }, {
                    label: 'bloq-enable-interrupt-change',
                    value: 'CHANGE'
                }]
        }]
    ],
    code: 'enableInterrupt({PIN}, {FUNC}, {STATE});'
    
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;