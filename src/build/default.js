//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
// @include ../utils.js
// @include ../bloq.js
// @include ../outputBloq.js
// @include ../statementBloq.js
// @include ../projectBloq.js
// @include ../../res/basic_bloqs.js
(function(root, undefined) {
    "use strict";
    var data = {
        bloqs: [],
        code: {
            setup: '',
            loop: ''
        }
    };
    var field = {};
    var canvas = {};
    data.createCanvas = function(element) {
        if ($.isEmptyObject(canvas)) {
            field = SVG(element).size('100%', '100%');
            canvas = field.group().attr('class', 'bloqs-canvas');
        }
        return canvas;
    };
    data.bloqsToCode = function() {
        data.functionCode(data.bloqs.setup, 'setup');
        data.functionCode(data.bloqs.loop, 'loop');
        return data.code.setup + data.code.loop;
    };
    data.functionCode = function(bloq, _function) {
        if (bloq === data.bloqs.loop || bloq === data.bloqs.setup) {
            data.code[_function] = bloq.code.loop;
        } else {
            data.code[_function] += '   ' + bloq.getCode(_function);
        }
        if (bloq.relations.codeChildren.length > 0) {
            data.functionCode(bloq.getBloqById(bloq.relations.codeChildren), _function);
        } else {
            data.code[_function] += '\n}\n';
        }
    };
    /**
     * Create a bloq and setup its properties and events.
     *
     * @param bloqData bloq object
     * @param canvas element to create the bloq into
     * @param position x,y position (just useful for the demo version)
     *
     * @returns Object bloq
     */
    data.createBloq = function(bloqData, canvas, position) {
        var bloq;
        if (bloqData.hasOwnProperty('output')) {
            bloq = newOutputBloq(bloqData, canvas, position, data);
        } else {
            bloq = newStatementBloq(bloqData, canvas, position, data);
        }
        data.bloqs.push(bloq);
        if (bloqData.label === 'loop') {
            data.bloqs.loop = bloq;
        } else if (bloqData.label === 'setup') {
            data.bloqs.setup = bloq;
        }
        return bloq;
    };
    /**
     * Create a set of bloqs and setup its properties and events.
     *
     * @param path path to the set of JSON files defining the bloqs
     *
     * @returns array of Object bloq
     */
    data.createProjectStructure = function() {
        var bloqTypes = getBasicBloqs();
        var counter = 100;
        for (var i in bloqTypes) {
            data.bloqs[i] = newProjectBloq(bloqTypes[i], canvas, [100, counter], data);
            counter += 100;
        }
    };
    // Base function.
    var bloqs = function() {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));