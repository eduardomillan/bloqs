/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'hts221Temperature',
    bloqClass: 'bloq-hts221-temperature',
    content: [
        [{
            alias: 'text',
            value: 'bloq-hts221-temperature'
        }, {
            id: 'SENSOR',
            alias: 'dynamicDropdown',
            options: 'hts221'
        }]
    ],
    code: '{SENSOR}.getTemperature()',
    returnType: {
        type: 'simple',
        value: 'float'
    }

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;