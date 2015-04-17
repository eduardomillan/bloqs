/*global define */
'use strict';

define(
    [
        'lodash',
        'bloqs/statementBloq'
    ],
    function(_, StatementBloq) {
        var SetVariableBloq = Object.create(StatementBloq);
        SetVariableBloq.name = 'setVariable';
        SetVariableBloq.content = [
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
        ];

        return SetVariableBloq;
    }
);