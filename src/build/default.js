/*global $:false */
/*global document:false */
/*global SVG:false */
/*global Option:false */
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
// @include ../statementInputBloq.js
// @include ../projectBloq.js
// @include ../../res/basic_bloqs.js
(function(root, undefined) {
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
        //LISTEN TO GLOBAL ONCHANGE
        document.getElementById("field1").addEventListener('change', function() {
            console.log('onchanging!!!');
        }, false);
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
            data.functionCode(utils.getBloqById(bloq.relations.codeChildren, data), _function);
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
        if (bloqData.hasOwnProperty('statementInput')) {
            bloq = new StatementInputBloq(bloqData, canvas, position, data, true);
        } else if (bloqData.hasOwnProperty('output')) {
            bloq = new OutputBloq(bloqData, canvas, position, data);
        } else if (bloqData.label === 'loop') {
            bloq = new ProjectBloq(bloqData, canvas, position, data);
            data.bloqs.loop = bloq;
        } else if (bloqData.label === 'setup') {
            bloq = new ProjectBloq(bloqData, canvas, position, data);
            data.bloqs.setup = bloq;
        } else {
            bloq = new StatementBloq(bloqData, canvas, position, data);
        }
        data.bloqs.push(bloq);
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
        var bloqTypes = getProjectBloqs();
        console.log('aaaaaaaaa', bloqTypes);
        var counter = 100;
        for (var i in bloqTypes) {
            data.bloqs.push(this.createBloq(bloqTypes[i], canvas, [50, counter], data));
            counter += 100;
        }
        this.createMenu();
    };
    data.createMenu = function() {
        var bloqTypes = getBasicBloqs();
        var counter = 20;
        for (var i in bloqTypes) {
            data.bloqs.push(this.createBloq(bloqTypes[i], canvas, [50, counter])); //i+2 due to setup & loop --> change this ASAP!!
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