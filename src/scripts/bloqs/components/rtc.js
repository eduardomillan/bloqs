/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {
    name: 'clockRTC',
    bloqClass: 'bloq-rtc',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rtc'
        },{
            id: 'RTC_FUNC',
            alias: 'staticDropdown',
             options: [{
                label: 'bloq-rtc-date',
                value: 'getDate'
            }, {
                label: 'bloq-rtc-time',
                value: 'getTime'
            }]
        }, {
            alias: 'text',
            value: 'bloq-rtc-using'
        }, {
            id: 'RTC',
            alias: 'dynamicDropdown',
            options: 'clocks'
        }]
    ],
    code: '{RTC}.{RTC_FUNC}()',
    returnType: {
        type: 'simple',
        value: 'String'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;