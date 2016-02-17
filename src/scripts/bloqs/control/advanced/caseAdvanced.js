//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: caseAdvanced
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if the variable
 *              compared in the switch bloq is equal to the given value.
 *
 * Return type: none
 */

var caseAdvanced = _.merge(_.clone(StatementInputBloq, true), {
    name: 'caseAdvanced',
    bloqClass: 'bloq-case-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-case-ifSameTo'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-case-exec'
        }]
    ],
    code: 'case {VAR}:{{STATEMENTS}break;}'
});

utils.generateBloqInputConnectors(caseAdvanced);

module.exports = caseAdvanced;