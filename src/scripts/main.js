/*global define */
'use strict';

define(['jquery', 'bloq'], function($, Bloq) {
    console.log('hi');

    var $field = $('#field');
    var bloq1 = new Bloq({
        bloqType: 'statementBloq'
    });
    console.log(bloq1);
    $field.append(bloq1);
});