//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
function Bloq(bloqData, canvas, position, data) {
    this.bloq = canvas.group().move(position[0], position[1]);
    this.canvas = canvas;
    this.data = data;
    this.size = {
        width: 100,
        height: 50
    };
    this.delta = {
        x: 0,
        y: 0,
        lastx: 0,
        lasty: 0
    };
    this.bloqInput = {
        width: 70,
        height: 50
    };
    this.code = bloqData.code;
    /**
     * We store relations here, using nodes
     * @type {{parent: undefined, children: Array}}
     */
    this.relations = {
        parent: undefined,
        children: [],
        codeChildren: [],
        inputChildren: []
    };
    //Create the connectors using the bloq information
    this.connections = utils.createConnectors(this, bloqData);
    // basic shape of the bloq
    this.body = this.bloq.rect(this.size.width, this.size.height).fill(bloqData.color).radius(4);
    // this.border = this.path(path).fill(bloqData.color).hide(); // give a hidden 'body' to the border path
    // this.border.stroke({
    //     color: '#e5a33b',
    //     width: 3
    // });
    this.size = {
        width: this.bloq.bbox().width,
        height: this.bloq.bbox().height
    };
    this.childrenHeight = 0;
    if (bloqData.hasOwnProperty('text')) {
        utils.createBloqUI(this, bloqData);
    }
    /**
     * Set this bloq as draggable
     */
    this.body.draggable();
}
/**
 * Resize a bloq and update its down connector, if any
 * @param bloq
 * @param delta
 */
Bloq.prototype.resize = function(delta) {
    this.size.width += delta.x;
    this.size.height += delta.y;
    if (this.body.children !== undefined) {
        this.body.children()[1].size(this.size.width, this.size.height);
    } else {
        this.body.size(this.size.width, this.size.height);
    }
    // this.border.size(this.size.width, this.size.height);
    // //this.selection.size(this.size.width, this.size.height);
    //update down connector:
    if (this.connections.down !== undefined) {
        utils.updateConnector(this.connections.down, {
            x: 0,
            y: delta.y
        });
    }
};
/**
 * We start dragging
 */
Bloq.prototype.dragmove = function(a) {
    this.dragmoveFlag = true;
    // remove parent of this and child in parent:
    if (this.relations.parent !== undefined) {
        //move dragged bloq on top
        utils.bloqOnTop(this.bloq);
        var parentBloq = this.getBloqById(this.relations.parent);
        if (parentBloq.relations.children[this.id()].connection === 'output') {
            for (var k in parentBloq.connections.inputs) {
                if (parentBloq.connections.inputs[k].inline === true && k === parentBloq.relations.children[this.id()].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
                    var delta = {
                        x: -this.size.width + parentBloq.bloqInput.width,
                        y: -this.size.height + parentBloq.bloqInput.height
                    };
                    parentBloq.resize(delta);
                    delta = {
                        x: -this.size.width + parentBloq.bloqInput.width,
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
        parentBloq.deleteChild(this);
        this.deleteParent(false);
    }
    //Update the deltaX and deltaY movements
    this.delta.x = a.x - this.delta.lastx;
    this.delta.y = a.y - this.delta.lasty;
    //Update the lastx and lasty variables
    this.delta.lastx = a.x;
    this.delta.lasty = a.y;
    //Update the bloq's connectors using the new deltas
    this.connections = utils.updateConnectors(this, this.delta);
    // move child bloqs along with this one
    utils.moveChildren(this, this.delta);
};
/**
 * We stop dragging
 */
Bloq.prototype.dragend = function() {
    //Flag used to prevent the execution of these functions when dragend is called after just a click on the bloq!
    if (this.dragmoveFlag) {
        //Initialize lasx y laxy
        this.delta.lastx = 0;
        this.delta.lasty = 0;
        var flag = false;
        var a;
        for (var j in this.connections) {
            if (flag === true) {
                break;
            }
            console.log('Searching connection in bloqs connection:++++++++++++++++++++++++++++++++++', j);
            for (var i in this.data.bloqs) {
                if (this.data.bloqs[i].node.id !== this.node.id) {
                    if (j === 'inputs') {
                        for (var k in this.connections[j]) {
                            a = utils.manageConnections(j, this.connections[j][k], this.data.bloqs[i].connections[utils.oppositeConnection[j]], this, this.data.bloqs[i], k);
                        }
                    } else if (j === 'output') {
                        for (var h in this.data.bloqs[i].connections[utils.oppositeConnection[j]]) {
                            a = utils.manageConnections(j, this.connections[j], this.data.bloqs[i].connections[utils.oppositeConnection[j]][h], this, this.data.bloqs[i], h);
                        }
                    } else {
                        a = utils.manageConnections(j, this.connections[j], this.data.bloqs[i].connections[utils.oppositeConnection[j]], this, this.data.bloqs[i]);
                    }
                }
            }
        }
        console.log('-----------------------------------------------------------------------');
        this.dragmoveFlag = false;
    }
};
Bloq.prototype.updateBloqs = function(parent, child, type, inputID) {
    parent.setChildren(child.node.id, type, inputID);
    child.setParent(parent.node.id);
};
Bloq.prototype.itsOver = function(dragRect, staticRect) {
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
Bloq.prototype.deleteParent = function(cascade) {
    if (cascade !== false) {
        var parentBloq = this.getBloqById(this.relations.parent);
        parentBloq.relations.children = [];
    }
    this.relations.parent = undefined;
};
Bloq.prototype.deleteChild = function(child) {
    var i = 0;
    //remove bloq from connection definition
    if (this.relations.children[child.node.id] !== undefined && this.relations.children[child.node.id].connection === 'output') {
        for (i in this.connections.inputs) {
            if (this.connections.inputs[i].bloq !== undefined && this.connections.inputs[i].this.id() === child.node.id) {
                this.connections.inputs[i].bloq = undefined;
                break;
            }
        }
    }
    //remove bloq from children 
    delete this.relations.children[child.node.id];
    for (i in this.relations.codeChildren) {
        if (this.relations.codeChildren[i] === child.node.id) {
            this.relations.codeChildren.splice(i, 1);
            break;
        }
    }
    delete this.relations.inputChildren[child.node.id];
    this.getChildrenHeight(true);
};
Bloq.prototype.setChildren = function(childrenId, location, inputID) {
    for (var bloqIndex in this.relations.children) {
        if (childrenId == this.relations.children[bloqIndex]) {
            // it exists, do nothing
            return false;
        }
    }
    console.log('childrenId', childrenId, this.data);
    // if we made it so far, add a new child
    this.relations.children[childrenId] = {
        bloq: this.getBloqById(childrenId),
        connection: location,
        inputID: inputID
    };
    for (bloqIndex in this.relations.codeChildren) {
        if (childrenId == this.relations.codeChildren[bloqIndex]) {
            // it exists, do nothing
            return false;
        }
    }
    if (location === 'up') {
        this.relations.codeChildren.push(childrenId);
    } else {
        this.relations.inputChildren[childrenId] = {
            bloq: this.getBloqById(childrenId),
            id: inputID
        };
    }
    // this.resizeStatementsInput({
    //     x: 0,
    //     y: this.childrenHeight
    // });
    this.getChildrenHeight(true);
    return true;
};
Bloq.prototype.setParent = function(parentId) {
    this.relations.parent = parentId;
    return true;
};
Bloq.prototype.getBloqById = function(nodeId) {
    for (var bloqIndex in this.data.bloqs) {
        var bloq = this.data.bloqs[bloqIndex];
        if (this.node.id == nodeId) {
            return bloq;
        }
    }
    return null;
};
Bloq.prototype.getCode = function(_function) {
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
            replacement = this.relations.inputChildren[i].this.getCode(_function);
        }
        code = code.replace(new RegExp(search, 'g'), replacement);
    }
    for (i = 0; i < this.inputsNumber; i++) {
        search = '{[' + i + ']}';
        code = code.replace(new RegExp(search, 'g'), ' ');
    }
    return code;
};
Bloq.prototype.getChildrenHeight = function(flag) {
    if (flag === true) {
        this.childrenHeight = 0;
    }
    var children;
    for (var i in this.relations.codeChildren) {
        children = this.relations.codeChildren[i];
        this.childrenHeight += this.getBloqById(children).size.height;
        if (children.relations !== undefined && children.relations.codeChildren !== undefined) {
            children.getChildrenHeight();
        }
    }
};
// Bloq.prototype.on('click', function() {
//     // if (this.label.toLowerCase() != 'loop' && this.label.toLowerCase() != 'setup') {
//     //     // remove other borders
//     //     var canvasChilds = canvas.children();
//     //     $.each(canvasChilds, function(index) {
//     //         if (canvasChilds[index].hasOwnProperty('border')) {
//     //             // hide selection
//     //             canvasChilds[index].selection.hide();
//     //         }
//     //     });
//     //     this.selection.show();
//     // }
// });
Bloq.prototype.resizeStatementsInput = function() {};
Bloq.prototype.resizeParents = function(direction) {
    var parentBloq = this.getBloqById(this.relations.parent);
    console.log('this.childrenHeight', this.childrenHeight);
    if (this.childrenHeight === 0) {
        this.childrenHeight += this.size.height;
    }
    while (parentBloq.relations !== undefined && parentBloq.relations.parent !== undefined) {
        parentBloq = this.getBloqById(parentBloq.relations.parent);
    }
    console.log('going up by : ', this.childrenHeight, direction, parentBloq);
    if (direction === 'up') {
        parentBloq.resizeStatementsInput({
            x: 0,
            y: -this.childrenHeight
        });
    } else {
        parentBloq.resizeStatementsInput({
            x: 0,
            y: this.childrenHeight
        });
    }
};