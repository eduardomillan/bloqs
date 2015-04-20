/*global define */
'use strict';

define(
    [
        'lodash',
        'bloqs/statementBloq'
    ],
    function(_, StatementBloq) {
        return _.merge(Object.create(StatementBloq), {
            name: 'setVariable',
            content: [
                [{
                    alias: 'stringInput',
                    placeholder: 'Introduce el nombre de la variable'
                }, {
                    alias: 'text',
                    value: '='
                }, {
                    alias: 'bloqInput',
                    acceptType: 'all'
                }]
            ]
        });
    }
);