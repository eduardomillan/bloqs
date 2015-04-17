/*global define */
'use strict';

define(
    [
        'jquery',
        'bloq',
        'bloqs/statementBloq',
        'bloqs/setVariableBloq'
    ],
    function($, Bloq, statementBloq, setVariableBloq) {

        console.log('hi');
        console.log(statementBloq);
        console.log(setVariableBloq);

        var $field = $('#field');
        var bloq1 = new Bloq({
            bloqType: 'statementBloq'
        });
        console.log(bloq1);
        $field.append(bloq1);
    }
);