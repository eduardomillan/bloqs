//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: oscillatorConf
 *
 * Bloq type: Statement
 *
 * Description: 
 *
 * Return type: none
 */

var oscillatorConf = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorConf',
    bloqClass: 'bloq-oscillator-conf',
    content: [
        [{
            id: 'OSCILLATOR',
            alias: 'dynamicDropdown',
            options: 'oscillators'
        }, {
            alias: 'text',
            value: 'con posición inicial'
        }, {
            id: 'PHASE',
            alias: 'numberInput',
            value: 90,
        }, {
            alias: 'text',
            value: 'grados, amplitud'
        }, {
            id: 'AMPLITUDE',
            alias: 'numberInput',
            value: 90,
        }, {
            alias: 'text',
            value: 'grados y desfase de'
        }, {
            id: 'PHI',
            alias: 'numberInput',
            value: 0,
        }, {
            alias: 'text',
            value: 'grados'
        }]
    ],
    code: ''
});

utils.generateBloqInputConnectors(oscillatorConf);

module.exports = oscillatorConf;