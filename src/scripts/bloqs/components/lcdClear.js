/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: lcdClear
 *
 * Bloq type: Statement
 *
 * Description: It clears the screen of a specific LCD,
 *              selectable from a drop-down.
 *
 * Return type: none
 */

var lcdClear = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdClear',
    bloqClass: 'bloq-lcd-clear',
    content: [
        [{
            alias: 'text',
            value: 'bloq-lcd-clear'
        }, {
            id: 'LCD',
            alias: 'dynamicDropdown',
            options: 'lcds'
        }]
    ],
    code: '{LCD}.clear();',
    arduino: {
        includes: [
            'Wire.h',
            'BitbloqLiquidCrystal.h'
        ],
        needInstanceOf: [{
            name: '{LCD}',
            type: 'LiquidCrystal',
            arguments: [0]
        }],
        setupExtraCode: '{LCD}.begin(16, 2);{LCD}.clear();',
        code: '{LCD}.clear();'
    }

});

utils.preprocessBloq(lcdClear);

module.exports = lcdClear;