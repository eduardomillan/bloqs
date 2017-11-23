/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: equidnaReadAccelXY
 *
 * Bloq type: Statement-Input
 *
 * Description:
 *
 * Return type: none
 */

var equidnaReadAccelXY = _.merge(_.clone(OutputBloq, true), {

    name: 'equidnaReadAccelXY',
    bloqClass: 'bloq-components-color',
    content: [
        [{
            alias: 'text',
            value: 'read-accelerometer'
        }, {
            id: 'AXIS',
            alias: 'staticDropdown',
            options: [{
                label: 'X',
                value: 'X'
            }, {
                label: 'Y',
                value: 'Y'
            }]
        }]
    ],
    returnType: {
        type: 'simple',
        value: 'float'
    },
    arduino: {
        conditional: {
            aliasId: 'AXIS',
            code: {
                'X': 'equidna.readAccX()',
                'Y': 'equidna.readAccY()'
            }
        }
    }
});

utils.preprocessBloq(equidnaReadAccelXY);

module.exports = equidnaReadAccelXY;