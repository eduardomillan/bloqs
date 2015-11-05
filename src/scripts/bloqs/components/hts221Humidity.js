/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    OutputBloq = require('./../outputBloq');

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'hts221Humidity',
    bloqClass: 'bloq-hts221-humidity',
    content: [
        [{
            alias: 'text',
            value: 'bloq-hts221-humidity'
        }, {
            id: 'SENSOR',
            alias: 'dynamicDropdown',
            options: 'hts221'
        }]
    ],
    code: '{SENSOR}.getHumidity()',
    returnType: {
        type: 'simple',
        value: 'float'
    }

});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;