//--IN PROGRESS--//

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: declareArray
 *
 * Bloq type: Statement
 *
 * Description: It declares a new variable array of the given size, called
 *              with the given name with a specific type, selectable from
 *              a drop-down.
 *
 * Return type: none
 */

var declareArray = _.merge(_.clone(StatementBloq, true), {

    name: 'declareArray',
    bloqClass: 'bloq-declare-array',
    content: [
        [{
            alias: 'text',
            value: 'bloq-declare-array'
        }, {
            id: 'NAME',
            alias: 'varInput',
            placeholder: 'bloq-name-default'
        }, {
            alias: 'text',
            value: 'bloq-declare-array-size'
        }, {
            bloqInputId: 'SIZE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-declare-array-type'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-declare-variable-declare-type-int',
                    value: 'int'
                }, {
                    label: 'bloq-declare-variable-declare-type-float',
                    value: 'float'
                }, {
                    label: 'bloq-declare-variable-declare-type-text',
                    value: 'String'
                }, {
                    label: 'bloq-declare-variable-declare-type-char',
                    value: 'char'
                }, {
                    label: 'bloq-declare-variable-declare-type-bool',
                    value: 'bool'
                }]
        }]
    ],
    code: '{TYPE} {NAME}[{SIZE}];',
    createDynamicContent: 'softwareVars',
    returnType: {
        type: 'fromDropdown',
        idDropdown: 'TYPE',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(declareArray);

module.exports = declareArray;