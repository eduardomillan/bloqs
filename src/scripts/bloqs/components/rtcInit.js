/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'clockRTCInit',
    bloqClass: 'bloq-rtc-init',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rtc-init'
        }, {
            id: 'RTC',
            alias: 'dynamicDropdown',
            options: 'clocks'
        }]
    ],
    code: '{RTC}.adjust(DateTime(__DATE__, __TIME__));'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;