//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = canvas.group().move(position[0], position[1]);
    bloq.size = {
        width: 100,
        height: 50
    };
    bloq.delta = {
        x: 0,
        y: 0,
        lastx: 0,
        lasty: 0
    };
    bloq.bloqInput = {
        width: 70,
        height: 50
    };
    bloq.code = bloqData.code;
    if (bloqData.hasOwnProperty('factoryCode')) {
        bloq.factoryCode = bloqData.factoryCode;
    } else {
        bloq.factoryCode = '';
    }
    /**
     * We store relations here, using nodes
     * @type {{parent: undefined, children: Array}}
     */
    bloq.relations = {
        parent: undefined,
        children: [],
        codeChildren: [],
        inputChildren: []
    };
    //Create the connectors using the bloq information
    bloq.connections = utils.createConnectors(bloq, bloqData);
    // basic shape of the bloq
    bloq.body = bloq.rect(bloq.size.width, bloq.size.height).fill(bloqData.color).radius(4);
    // bloq.border = bloq.path(path).fill(bloqData.color).hide(); // give a hidden 'body' to the border path
    // bloq.border.stroke({
    //     color: '#e5a33b',
    //     width: 3
    // });
    bloq.size = {
        width: bloq.bbox().width,
        height: bloq.bbox().height
    };
    bloq.childrenHeight = 0;
    /**
     * Resize a bloq and update its down connector, if any
     * @param bloq
     * @param delta
     */
    bloq.resize = function(delta) {
        "use strict";
        bloq.size.width += delta.x;
        bloq.size.height += delta.y;
        if (bloq.body.children !== undefined) {
            bloq.body.children()[1].size(bloq.size.width, bloq.size.height);
        } else {
            bloq.body.size(bloq.size.width, bloq.size.height);
        }
        // bloq.border.size(bloq.size.width, bloq.size.height);
        // //bloq.selection.size(bloq.size.width, bloq.size.height);
        //update down connector:
        if (bloq.connections.down !== undefined) {
            utils.updateConnector(bloq.connections.down, {
                x: 0,
                y: delta.y
            });
        }
    };
    if (bloqData.hasOwnProperty('text')) {
        utils.createBloqUI(bloq, bloqData);
    }
    /**
     * Set this bloq as draggable
     */
    if (bloq.label !== 'setup' && bloq.label !== 'loop') {
        bloq.draggable();
    }
    /**
     * We start dragging
     */
    bloq.dragmove = function(a) {
        bloq.dragmoveFlag = true;
        // remove parent of this and child in parent:
        if (bloq.relations.parent !== undefined) {
            //move dragged bloq on top
            utils.bloqOnTop(bloq);
            var parentBloq = bloq.getBloqById(bloq.relations.parent);
            if (parentBloq.relations.children[bloq.id()].connection === 'output') {
                for (var k in parentBloq.connections.inputs) {
                    if (parentBloq.connections.inputs[k].inline === true && k === parentBloq.relations.children[bloq.id()].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
                        var delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: -bloq.size.height + parentBloq.bloqInput.height
                        };
                        parentBloq.resize(delta);
                        delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: 0
                        };
                        for (var i in parentBloq.UIElements) {
                            if (parentBloq.UIElements[i].id === parseInt(k, 10)) {
                                utils.pushElements(parentBloq, parentBloq.UIElements[i], delta);
                                break;
                            }
                        }
                    }
                }
            }
            parentBloq.deleteChild(bloq);
            bloq.deleteParent(false);
        }
        //Update the deltaX and deltaY movements
        bloq.delta.x = a.x - bloq.delta.lastx;
        bloq.delta.y = a.y - bloq.delta.lasty;
        //Update the lastx and lasty variables
        bloq.delta.lastx = a.x;
        bloq.delta.lasty = a.y;
        //Update the bloq's connectors using the new deltas
        bloq.connections = utils.updateConnectors(bloq, bloq.delta);
        // move child bloqs along with this one
        utils.moveChildren(bloq, bloq.delta);
    };
    /**
     * We stop dragging
     */
    bloq.dragend = function() {
        //Flag used to prevent the execution of these functions when dragend is called after just a click on the bloq!
        if (bloq.dragmoveFlag) {
            //Initialize lasx y laxy
            bloq.delta.lastx = 0;
            bloq.delta.lasty = 0;
            var flag = false;
            var a;
            for (var j in bloq.connections) {
                if (flag === true) {
                    break;
                }
                console.log('Searching connection in bloqs connection:++++++++++++++++++++++++++++++++++', j);
                for (var i in data.bloqs) {
                    if (data.bloqs[i].node.id !== bloq.node.id) {
                        if (j === 'inputs') {
                            for (var k in bloq.connections[j]) {
                                a = utils.manageConnections(j, bloq.connections[j][k], data.bloqs[i].connections[utils.oppositeConnection[j]], bloq, data.bloqs[i], k);
                            }
                        } else if (j === 'output') {
                            for (var h in data.bloqs[i].connections[utils.oppositeConnection[j]]) {
                                a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]][h], bloq, data.bloqs[i], h);
                            }
                        } else {
                            a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]], bloq, data.bloqs[i]);
                        }
                    }
                }
            }
            console.log('-----------------------------------------------------------------------');
            bloq.dragmoveFlag = false;
        }
    };
    bloq.updateBloqs = function(parent, child, type, inputID) {
        parent.setChildren(child.node.id, type, inputID);
        child.setParent(parent.node.id);
    };
    bloq.itsOver = function(dragRect, staticRect) {
        if (dragRect !== undefined && staticRect !== undefined) {
            // console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1);
            // console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1 < staticRect.x2, dragRect.x2 > staticRect.x1, dragRect.y1 < staticRect.y2, dragRect.y2 > staticRect.y1);
            // console.log('dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1', dragRect.x1, staticRect.x2, dragRect.x2, staticRect.x1, dragRect.y1, staticRect.y2, dragRect.y2, staticRect.y1);
            return dragRect.x1 < staticRect.x2 && dragRect.x2 > staticRect.x1 && dragRect.y1 < staticRect.y2 && dragRect.y2 > staticRect.y1;
        } else {
            return false;
        }
    };
    // utilities
    bloq.deleteParent = function(cascade) {
        if (cascade !== false) {
            var parentBloq = this.getBloqById(this.relations.parent);
            parentBloq.relations.children = [];
        }
        this.relations.parent = undefined;
    };
    bloq.deleteChild = function(child) {
        //remove bloq from connection definition
        if (this.relations.children[child.node.id] !== undefined && this.relations.children[child.node.id].connection === 'output') {
            for (var i in this.connections.inputs) {
                if (this.connections.inputs[i].bloq !== undefined && this.connections.inputs[i].bloq.id() === child.node.id) {
                    this.connections.inputs[i].bloq = undefined;
                    break;
                }
            }
        }
        //remove bloq from children 
        delete bloq.relations.children[child.node.id];
        for (var i in this.relations.codeChildren) {
            if (this.relations.codeChildren[i] === child.node.id) {
                this.relations.codeChildren.splice(i, 1);
                break;
            }
        }
        delete this.relations.inputChildren[child.node.id];
    };

    bloq.setChildren = function(childrenId, location, inputID) {
        for (var bloqIndex in bloq.relations.children) {
            if (childrenId == bloq.relations.children[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
        console.log('childrenId', childrenId, data);
        // if we made it so far, add a new child
        bloq.relations.children[childrenId] = {
            bloq: bloq.getBloqById(childrenId),
            connection: location,
            inputID: inputID
        };
        for (bloqIndex in bloq.relations.codeChildren) {
            if (childrenId == bloq.relations.codeChildren[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
        if (location === 'up') {
            bloq.relations.codeChildren.push(childrenId);
        } else {
            bloq.relations.inputChildren[childrenId] = {
                bloq: bloq.getBloqById(childrenId),
                id: inputID
            };
        }
        bloq.resizeStatementsInput({
            x: 0,
            y: bloq.childrenHeight
        });
        return true;
    };
    bloq.setParent = function(parentId) {
        bloq.relations.parent = parentId;
        return true;
    };
    bloq.getBloqById = function(nodeId) {
        for (var bloqIndex in data.bloqs) {
            var bloq = data.bloqs[bloqIndex];
            if (bloq.node.id == nodeId) {
                return bloq;
            }
        }
        return null;
    };
    bloq.getCode = function(_function) {
        var code = this.code[_function];
        var search = '';
        var replacement = '';
        var id;
        for (var i in this.relations.inputChildren) {
            id = this.relations.inputChildren[i].id;
            id = id.substr(id.indexOf('_') + 1, id.length);
            search = '{[' + id + ']}';
            if (this.relations.inputChildren[i].bloq === 'userInput' || this.relations.inputChildren[i].bloq === 'dropdown') {
                replacement = this.relations.inputChildren[i].code;
            } else {
                replacement = this.relations.inputChildren[i].bloq.getCode(_function);
            }
            code = code.replace(new RegExp(search, 'g'), replacement);
        }
        for (i = 0; i < this.inputsNumber; i++) {
            search = '{[' + i + ']}';
            code = code.replace(new RegExp(search, 'g'), ' ');
        }
        return code;
    };
    bloq.getChildrenHeight = function(flag) {
        if (flag === true){
            bloq.childrenHeight = 0;
        }
        var children;
        for (var i in bloq.relations.codeChildren) {
            children = bloq.relations.codeChildren;
            bloq.childrenHeight += bloq.getBloqById(children).size.height;
            if (children.relations !== undefined && children.relations.codeChildren !== undefined) {
                children.getChildrenHeight();
            }
        }
    };
    bloq.on('click', function() {
        // if (this.label.toLowerCase() != 'loop' && this.label.toLowerCase() != 'setup') {
        //     // remove other borders
        //     var canvasChilds = canvas.children();
        //     $.each(canvasChilds, function(index) {
        //         if (canvasChilds[index].hasOwnProperty('border')) {
        //             // hide selection
        //             canvasChilds[index].selection.hide();
        //         }
        //     });
        //     this.selection.show();
        // }
    });
    bloq.resizeStatementsInput = function() {};
    return bloq;
};