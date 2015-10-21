/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../../utils'),
    OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {
    name: 'clockRTCAdvanced',
    bloqClass: 'bloq-rtc-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rtc-advanced'
        },{
            id: 'FUNCTION',
            alias: 'staticDropdown',
             options: [{
                label: 'bloq-rtc-hour',
                value: 'getHour'
            },{
                label: 'bloq-rtc-minute',
                value: 'getMinute'
            }, {
                label: 'bloq-rtc-second',
                value: 'getSecond'
            }, {
                label: 'bloq-rtc-day',
                value: 'getDay'
            }, {
                label: 'bloq-rtc-month',
                value: 'getMonth'
            }, {
                label: 'bloq-rtc-year',
                value: 'getYear'
            }]
        }, {
            alias: 'text',
            value: 'bloq-rtc-using-advanced'
        }, {
            id: 'RTC',
            alias: 'dynamicDropdown',
            options: 'clocks'
        }]
    ],
    code: '{RTC}.{FUNCTION}()',
    returnType: {
        type: 'simple',
        value: 'int'
    }
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;