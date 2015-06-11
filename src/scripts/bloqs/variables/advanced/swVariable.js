/*global require */
'use strict';

var _ = require('lodash');
var OutputBloq = require('./../../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'swVariable',
    bloqClass: 'bloq-sw-variable-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-sw-variable-advanced-variable'
        }, {
            id: 'VALUE',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }]
    ],
    code: '{VALUE}',
    returnType: {
        type: 'simple',
        value: 'var'
    }
});

module.exports = bloq;