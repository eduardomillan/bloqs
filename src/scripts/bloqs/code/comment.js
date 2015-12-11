/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./../statementBloq');

var bloq = _.merge(_.clone(StatementBloq, true), {

    name: 'comment',
    bloqClass: 'bloq-comment',
    content: [
        [{
            alias: 'text',
            value: 'bloq-comment-comment'
        }, {
            id: 'COMMENT',
            alias: 'multilineCommentInput',
            placeholder:'bloq-comment-default'
        }]
    ],
    code: '/*\n{COMMENT}\n*/'
});

module.exports = bloq;