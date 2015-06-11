/*global require */
'use strict';

var _ = require('lodash');
var OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'hwVariable',
    bloqClass: 'bloq-hw-variable-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-hw-variable-advanced-variable'
        }, {
            id: 'VALUE',
            alias: 'dynamicDropdown',
            options: 'varComponents'
        }]
    ],
    code: '{VALUE}',
    returnType: {
        type: 'simple',
        value: 'var'
    }
});

module.exports = bloq;