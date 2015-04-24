/*global require */
'use strict';

var _ = require('lodash');
var OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'string',
    content: [
        [{
            alias: 'text',
            value: '"'
        }, {
            alias: 'stringInput',
            value: 'Texto'
        }, {
            alias: 'text',
            value: '"'
        }]
    ],
    code: {
        setup: ['{0}'],
        loop: ['{0}']
    }
});

module.exports = bloq;