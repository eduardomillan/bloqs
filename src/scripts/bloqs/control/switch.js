/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {

    name: 'switch',
    bloqClass: 'bloq-switch',
    content: [
        [{
                alias: 'text',
                value: 'Comprobar cuál es el valor de '
            }, {
                id: 'VAR',
                alias: 'dynamicDropdown',
                options: 'softwareVars'
            }
            // , {
            //     alias: 'text',
            //     value: 'ejecutar:'
            // }
        ]
    ],
    code: 'switch ({VAR}):{{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;