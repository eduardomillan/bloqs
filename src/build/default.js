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
        element: '',
        canvas: null,
        code: {
            setup: '',
            loop: ''
        },
        variables: [],
        globalVariables: [],
        localVariables: [],
        project: []
    };
    var field = {};
    var canvas = {};
    data.createCanvas = function(element) {
        if ($.isEmptyObject(canvas)) {
            data.element = element;
            field = SVG(element).size('100%', '100%');
            canvas = field.group().attr('class', 'bloqs-canvas');
        }
        //LISTEN TO GLOBAL ONCHANGE
        // document.getElementById(element).addEventListener('change', function() {
        // }, false);
        data.canvas = canvas;
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
    data.getBloq = function(bloqName, canvas, position) {
        return data.createBloq(getBasicBloqs(data.variables)[bloqName], this.canvas, position);
    }
    /**
     * Create a set of bloqs and setup its properties and events.
     *
     * @param path path to the set of JSON files defining the bloqs
     *
     * @returns array of Object bloq
     */
    data.createProjectStructure = function() {
        var bloqTypes = getProjectBloqs();
        var counter = 100;
        for (var i in bloqTypes) {
            data.bloqs.push(this.createBloq(bloqTypes[i], canvas, [50, counter], data));
            counter += 100;
        }
        // this.createMenu();
    };
    data.createMenu = function() {
        var bloqTypes = getBasicBloqs();
        var counter = 20;
        for (var i in bloqTypes) {
            data.bloqs.push(this.createBloq(bloqTypes[i], canvas, [50, counter]));
            counter += 100;
        }
    };
    data.saveProject = function() {
        // data.getChildBloqs(data.bloqs.setup, data.project.setup);
        data.getChildBloqs(data.bloqs.loop);
        console.log('savingproject:', JSON.stringify(data.project));
        data.project = [];
    };
    data.getChildBloqs = function(bloq) {
        var bloqDescription = [];
        if (bloq !== null) {
            if (bloq.relations !== undefined) {
                bloqDescription = this.getBloqData(bloq);
                data.project.push({
                    bloq: bloq.bloqName,
                    inputs: bloqDescription,
                    location: [bloq.bloqBody.x(), bloq.bloqBody.y()]
                });
                if (bloq.relations.codeChildren !== undefined) {
                    var codeChild = utils.getBloqById(bloq.relations.codeChildren[0], this);
                    this.getChildBloqs(codeChild, data.project);
                }
            }
        }
    };
    data.getBloqData = function(bloq) {
        var bloqDescription = [];
        if (bloq.relations.inputChildren !== undefined) {
            for (var i in bloq.relations.inputChildren) {
                if (bloq.relations.inputChildren[i].bloq === 'userInput') {
                    bloqDescription.push({
                        userInput: bloq.relations.inputChildren[i].code
                    });
                }
                if (bloq.relations.inputChildren[i].bloq === 'dropdown') {
                    bloqDescription.push({
                        dropdown: bloq.relations.inputChildren[i].code
                    });
                }
                if (bloq.relations.inputChildren[i].bloq !== undefined && bloq.relations.inputChildren[i].bloq.bloqName !== undefined) {
                    var child = bloq.relations.inputChildren[i].bloq;
                    if (child.relations.inputChildren !== undefined) {
                        console.log('this.getBloqData(child)', this.getBloqData(child));
                        bloqDescription.push(this.getBloqData(child));
                    } else {
                        bloqDescription.push({
                            bloq: bloq.relations.inputChildren[i].bloq.bloqName,
                            location: [bloq.relations.inputChildren[i].bloq.bloqBody.x(), bloq.relations.inputChildren[i].bloq.bloqBody.y()]
                        });
                    }
                }
            }
        }
        return bloqDescription;
    };
    data.loadProject = function(project) {
        console.log('project_JSON', project);
        for (var i in project) {
            if (project[i].bloq !== undefined && project[i].bloq !== 'loop' && project[i].bloq !== 'setup') {
                console.log('project[i].bloq', project[i].bloq.location);
                this.getBloq(project[i].bloq, this.canvas, project[i].location);
            }
            console.log('project[i]', project[i].bloq);
        }
    };
    // Base function.
    var bloqs = function() {
        return data;
    };
    // Export to the root, which is probably `window`.
    root.bloqs = bloqs;
}(this));