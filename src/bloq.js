//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
function Bloq(bloqData, canvas, position, data) {
    this.bloqBody = canvas.group().move(position[0], position[1]);
    this.bloqData = bloqData;
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
    this.code = this.bloqData.code;
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
    this.createConnectors();
    // basic shape of the bloq
    this.body = this.bloqBody.rect(this.size.width, this.size.height).fill(bloqData.color).radius(4);
    this.id = this.body.node.id;
    // this.border = this.path(path).fill(bloqData.color).hide(); // give a hidden 'body' to the border path
    // this.border.stroke({
    //     color: '#e5a33b',
    //     width: 3
    // });
    this.size = {
        width: this.bloqBody.bbox().width,
        height: this.bloqBody.bbox().height
    };
    this.childrenHeight = 0;
    if (this.bloqData.hasOwnProperty('text')) {
        this.createBloqUI();
    }
    this.bloqBody.dragmove = Bloq.prototype.dragmove;
    this.bloqBody.dragend = Bloq.prototype.dragend;
    var that = this;
    this.bloqBody.getBloqObject = function() {
        return that;
    };
}
/**
 * Resize a bloq and update its down connector, if any
 * @param bloq
 * @param delta
 */
Bloq.prototype.resize = function(delta) {
    this.size.width += delta.x;
    this.size.height += delta.y;
    if (this.bloqBody.children !== undefined) {
        this.bloqBody.children()[0].size(this.size.width, this.size.height);
    } else {
        this.bloqBody.size(this.size.width, this.size.height);
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
    //Set the dragmove flag to true because we are dragging the bloq
    this.dragmoveFlag = true;
    //Get the parent bloq to use its functions
    var bloq = this.getBloqObject();
    //move dragged bloq on top
    utils.bloqOnTop(this.bloqBody);
    // remove parent of this and child in parent:
    if (bloq.relations.parent !== undefined) {
        var parentBloq = utils.getBloqById(bloq.relations.parent, bloq.data);
        //resize UI if needed
        parentBloq.resizeUI();
        //remove child from parent and parent from child
        parentBloq.deleteChild(this.getBloqObject());
        this.getBloqObject().deleteParent(false);
    }
    //update the deltas:
    bloq.updateDeltas(a);
    //Update the bloq's connectors using the new deltas
    bloq.updateConnectors(bloq.delta);
    // move child bloqs along with this one
    bloq.moveChildren({x:bloq.delta.x, y:bloq.delta.y});
};
/**
 * We stop dragging
 */
Bloq.prototype.dragend = function() {
    //Flag used to prevent the execution of these functions when dragend is called after just a click on the bloq!
    if (this.dragmoveFlag) {
        //Get the parent bloq to use its functions
        var bloq = this.getBloqObject();
        //Initialize lastx y lasty
        bloq.resetLastDelta();
        //Check for connections:
        bloq.searchNewConnections();
        this.dragmoveFlag = false;
    }
};
/**
 * Updates de position of the connectors of a bloq (used after modifying the bloq's position)
 * @param bloq
 */
Bloq.prototype.updateConnectors = function(delta) {
    for (var type in this.connections) {
        if (this.connections[type] && type === 'inputs') {
            for (var i in this.connections[type]) {
                utils.updateConnector(this.connections[type][i], delta);
            }
        } else if (this.connections[type]) {
            utils.updateConnector(this.connections[type], delta);
        }
    }
};
Bloq.prototype.resizeUI = function() {
    // if (parentBloq.bloqBody.relations.children[this.getBloqObject().id].connection === 'output') {
    //     for (var k in parentBloq.bloqBody.connections.inputs) {
    //         if (parentBloq.bloqBody.connections.inputs[k].inline === true && k === parentBloq.bloqBody.relations.children[this.getBloqObject().id].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
    //             var delta = {
    //                 x: +this.getBloqObject().size.width - parentBloq.size.width,
    //                 y: +this.getBloqObject().size.height - parentBloq.size.height
    //             };
    //             parentBloq.resize(delta);
    //             delta = {
    //                 x: this.getBloqObject().size.width - parentBloq.size.width,
    //                 y: 0
    //             };
    //             for (var i in parentBloq.UIElements) {
    //                 if (parentBloq.UIElements[i].id === parseInt(k, 10)) {
    //                     utils.pushElements(parentBloq, parentBloq.UIElements[i], delta);
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }
};
Bloq.prototype.updateDeltas = function(a) {
    //Update the deltaX and deltaY movements
    this.delta.x = a.x - this.delta.lastx;
    this.delta.y = a.y - this.delta.lasty;
    //Update the lastx and lasty variables
    this.delta.lastx = a.x;
    this.delta.lasty = a.y;
};
Bloq.prototype.getParent = function() {
    return this.relations.parent;
};
Bloq.prototype.resetLastDelta = function() {
    this.delta.lastx = 0;
    this.delta.lasty = 0;
};
Bloq.prototype.searchNewConnections = function() {
    var a;
    for (var j in this.connections) {
        console.log('Searching connection in bloqs connection:++++++++++++++++++++++++++++++++++', j);
        for (var i in this.data.bloqs) {
            if (this.data.bloqs[i].id !== this.id) {
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
};
///////////////////////// UTILITIES
Bloq.prototype.updateBloqs = function(parent, child, type, inputID) {
    parent.setChildren(child.id, type, inputID);
    child.setParent(parent.id);
};
Bloq.prototype.deleteParent = function(cascade) {
    if (cascade !== false) {
        var parentBloq = utils.getBloqById(this.relations.parent, this.bloqBody.data);
        parentBloq.bloqBody.relations.children = [];
    }
    this.relations.parent = undefined;
};
Bloq.prototype.deleteChild = function(child) {
    var i = 0;
    //remove bloq from connection definition
    if (this.relations.children[child.id] !== undefined && this.relations.children[child.id].connection === 'output') {
        for (i in this.connections.inputs) {
            if (this.connections.inputs[i].bloq !== undefined && this.connections.inputs[i].bloq.id === child.id) {
                this.connections.inputs[i].bloq = undefined;
                break;
            }
        }
    }
    //remove bloq from children 
    delete this.relations.children[child.id];
    for (i in this.relations.codeChildren) {
        if (this.relations.codeChildren[i] === child.id) {
            this.relations.codeChildren.splice(i, 1);
            break;
        }
    }
    delete this.relations.inputChildren[child.id];
    this.getChildrenHeight(true);
};
Bloq.prototype.setChildren = function(childrenId, location, inputID) {
    for (var bloqIndex in this.relations.children) {
        if (childrenId == this.relations.children[bloqIndex]) {
            // it exists, do nothing
            return false;
        }
    }
    // if we made it so far, add a new child
    this.relations.children[childrenId] = {
        bloq: utils.getBloqById(childrenId, this.data),
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
            bloq: utils.getBloqById(childrenId, this.bloqBody.data),
            id: inputID
        };
    }
    this.getChildrenHeight(true);
    return true;
};
Bloq.prototype.setParent = function(parentId) {
    this.relations.parent = parentId;
    return true;
};
Bloq.prototype.getChildrenHeight = function(flag) {
    // if (flag === true) {
    //     this.childrenHeight = 0;
    // }
    // var child;
    // for (var i in this.relations.codeChildren) {
    //     child = this.relations.codeChildren[i];
    //     child = utils.getBloqById(child, this.bloqBody.data);
    //     this.childrenHeight += child.size.height;
    //     if (child.bloqBody.relations !== undefined && child.bloqBody.relations.codeChildren !== undefined) {
    //         child.getChildrenHeight();
    //     }
    // }
    // if (this.relations.codeChildren.length === 0) {
    //     this.childrenHeight = this.size.height;
    // }
};
/////////// CODE FUNCTIONS
Bloq.prototype.getCode = function(_function) {
    var code = this.code[_function];
    var search = '';
    var replacement = '';
    var id;
    for (var i in this.relations.inputChildren) {
        id = this.relations.inputChildren[i].id;
        id = id.substr(id.indexOf('_') + 1, id.length);
        search = '{[' + id + ']}';
        console.log('------------------->', this.relations.inputChildren[i].bloq);
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
//////////////////////// CONNECTORS FUNCTIONS
Bloq.prototype.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
    if (connectionType === 'up') {
        return {
            x: this.connections[connectionType].connectionPosition.x,
            y: this.connections[connectionType].connectionPosition.y - bloqToConnect.size.height
        };
    }
    if (connectionType === 'output') {
        return {
            x: this.connections[connectionType].connectionPosition.x - bloqToConnect.size.width,
            y: this.connections[connectionType].connectionPosition.y - inputID * connectionThreshold
        };
    }
    if (connectionType === 'inputs') {
        console.log('--------------------------------------------------> MOVING DOWN');
        for (var k in this.connections[connectionType]) {
            //If the input is inline and there is not a bloq connected still
            if (this.connections[connectionType][k].inline === true && k === inputID && this.connections[connectionType][k].bloq === undefined) {
                var delta = {
                    x: bloqToConnect.size.width,
                    y: 0
                };
                this.resize(delta);
                delta = {
                    x: bloqToConnect.size.width,
                    y: 0
                };
                for (var i in this.UIElements) {
                    if (this.UIElements[i].id === parseInt(inputID, 10)) {
                        console.log('here pushing', this.UIElements[i].elementsToPush);
                        utils.pushElements(this, this.UIElements[i], delta);
                        break;
                    }
                }
            }
        }
        return this.connections[connectionType][inputID].connectionPosition;
    }
    return this.connections[connectionType].connectionPosition;
};
Bloq.prototype.resizeStatementsInput = function() {};
Bloq.prototype.resizeParents = function(direction) {
    var parentBloq = utils.getBloqById(this.relations.parent, this.data);
    console.log('this.childrenHeight', this.childrenHeight);
    while (parentBloq.relations !== undefined && parentBloq.relations.parent !== undefined) {
        parentBloq = utils.getBloqById(parentBloq.relations.parent, this.data);
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
Bloq.prototype.createConnectors = function() {
    this.connections = {};
    if (this.bloqData.inputs) {
        this.connections.inputs = [{}];
        for (var i in this.bloqData.inputs) {
            i = parseInt(i, 10);
            this.connections.inputs[i] = {
                connectionPosition: {},
                connectorArea: {},
                type: ''
            };
            this.connections.inputs[i].connectionPosition = {
                x: this.bloqBody.x() + this.size.width,
                y: this.bloqBody.y() + i * connectionThreshold
            };
            this.connections.inputs[i].connectorArea = {
                x1: this.bloqBody.x() + this.size.width - connectionThreshold,
                x2: this.bloqBody.x() + this.size.width + connectionThreshold,
                y1: this.bloqBody.y() + i * connectionThreshold,
                y2: this.bloqBody.y() + i * connectionThreshold + connectionThreshold
            };
            this.connections.inputs[i].type = this.bloqData.inputs[i];
            this.connections.inputs[i].movedDown = false;
            //Update bloq's size
            this.resize({
                x: 0,
                y: connectionThreshold
            });
            this.connections.inputs[i].UI = this.canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
                fill: getRandomColor()
            }).move(this.bloqBody.x() + this.size.width - connectionThreshold, this.bloqBody.y() + i * connectionThreshold);
        }
    }
    if (this.bloqData.output) {
        this.connections.output = {
            connectionPosition: {},
            connectorArea: {},
            type: this.bloqData.output
        };
        this.connections.output.connectionPosition = {
            x: this.bloqBody.x(),
            y: this.bloqBody.y()
        };
        this.connections.output.connectorArea = {
            x1: this.bloqBody.x() - connectionThreshold,
            x2: this.bloqBody.x() + connectionThreshold,
            y1: this.bloqBody.y(),
            y2: this.bloqBody.y() + connectionThreshold
        };
        this.connections.output.UI = this.canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: '#FFCC33'
        }).move(this.bloqBody.x() - connectionThreshold, this.bloqBody.y());
    }
    if (this.bloqData.up) {
        this.connections.up = {
            connectionPosition: {},
            connectorArea: {}
        };
        this.connections.up.connectionPosition = {
            x: this.bloqBody.x(),
            y: this.bloqBody.y()
        };
        this.connections.up.connectorArea = {
            x1: this.bloqBody.x(),
            x2: this.bloqBody.x() + connectionThreshold,
            y1: this.bloqBody.y() - connectionThreshold,
            y2: this.bloqBody.y() + connectionThreshold
        };
        this.connections.up.UI = this.canvas.group().rect(connectionThreshold, connectionThreshold * 2).attr({
            fill: '#FF0000'
        }).move(this.bloqBody.x(), this.bloqBody.y() - connectionThreshold);
    }
    if (this.bloqData.down) {
        this.connections.down = {
            connectionPosition: {},
            connectorArea: {}
        };
        this.connections.down.connectionPosition = {
            x: this.bloqBody.x(),
            y: this.bloqBody.y() + this.size.height
        };
        this.connections.down.connectorArea = {
            x1: this.bloqBody.x(),
            x2: this.bloqBody.x() + connectionThreshold,
            y1: this.bloqBody.y() + this.size.height - connectionThreshold,
            y2: this.bloqBody.y() + this.size.height + connectionThreshold
        };
        this.connections.down.UI = this.canvas.group().rect(connectionThreshold, connectionThreshold * 2).attr({
            fill: '#FF0000'
        }).move(this.bloqBody.x(), this.bloqBody.y() + this.size.height - connectionThreshold);
    }
};
Bloq.prototype.addInput = function(posx, posy, type) {
    var index = 0;
    if (this.connections.inputs !== undefined) {
        index = this.connections.inputs.length;
    } else {
        this.connections.inputs = [{}];
    }
    this.connections.inputs[index] = {
        connectionPosition: {
            x: posx,
            y: posy
        },
        connectorArea: {
            x1: posx - connectionThreshold,
            x2: posx + connectionThreshold,
            y1: posy,
            y2: posy + connectionThreshold
        },
        type: type,
        inline: true,
        movedDown: false
    };
    if (posx !== undefined && posy !== undefined) {
        this.connections.inputs[index].UI = this.canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: getRandomColor()
        }).move(posx - connectionThreshold, posy);
    }
    this.inputsNumber = this.connections.inputs.length;
};
utils.pushElements = function(bloq, UIElement, delta) {
    var elements = UIElement.elementsToPush;
    for (var j in elements) {
        elements[j].bloq.x(elements[j].bloq.x() + delta.x);
        elements[j].bloq.y(elements[j].bloq.y() + delta.y);
        var connector = elements[j].connector;
        if (connector !== undefined) {
            utils.moveConnector(bloq, connector, delta);
        }
    }
};
///// BLOQ UI
Bloq.prototype.appendUserInput = function(inputText, type, posx, posy, id) {
    var text = this.bloqBody.foreignObject(100, 100).attr({
        id: 'fobj',
        color: '#FFCC33'
    });
    text.appendChild("input", {
        id: id,
        value: inputText,
        color: '#FFCC33',
    }).move(posx, posy);
    this.UIElements.push({
        element: text,
        elementsToPush: undefined
    });
    var code;
    if (type === 'number') {
        code = document.getElementById(id).value;
    } else {
        code = '"' + document.getElementById(id).value + '"';
    }
    this.relations.inputChildren[id] = {
        id: id,
        bloq: 'userInput',
        code: code
    };
    this.addInput(undefined, undefined, type);
    document.getElementById(id).addEventListener("mousedown", function(e) {
        e.stopPropagation();
    }, false);
    var that = this;
    //Check that the input of the user is the one spected
    document.getElementById(id).addEventListener("change", function() {
        if (type === 'number') {
            if (isNaN(parseFloat(document.getElementById(id).value))) {
                //If type is number and input is not a number, remove user input. 
                //ToDo : UX warning!
                document.getElementById(id).value = '';
            } else {
                that.relations.inputChildren[id].code = document.getElementById(id).value;
            }
        } else {
            that.relations.inputChildren[id].code = '"' + document.getElementById(id).value + '"';
        }
    }, false);
};
Bloq.prototype.appendDropdownInput = function(dropdownText, type, posx, posy, id) {
    var dropdown = this.bloqBody.foreignObject(100, 100).attr({
        id: id,
        color: '#FFCC33'
    });
    var newList = document.createElement("select");
    for (var i in dropdownText) {
        var newListData = new Option(dropdownText[i].label, dropdownText[i].value);
        //Here we append that text node to our drop down list.
        newList.appendChild(newListData);
    }
    this.addInput(undefined, undefined, type);
    //Append the list to dropdown foreignobject:
    dropdown.appendChild(newList).move(posx, posy);
    this.UIElements.push({
        element: dropdown,
        elementsToPush: undefined
    });
    this.relations.inputChildren[id] = {
        id: id,
        bloq: 'userInput',
        code: newList.value
    };
    var that = this;
    newList.onchange = function() {
        that.relations.inputChildren[id].code = newList.value;
    };
    document.getElementById(id).addEventListener("mousedown", function(e) {
        e.stopPropagation();
    }, false);
};
Bloq.prototype.appendBloqInput = function(inputText, type, posx, posy, inputID) {
    //draw white (ToDo: UX) rectangle
    var bloqInput = utils.getOutputBloq(this.bloqBody, posx, this.bloqInput.width, this.bloqInput.height);
    this.addInput(this.bloqBody.x() + posx, this.bloqBody.y() + posy, type); //bloq.x()+posx + width, bloq.x()+posy + i * connectionThreshold);
    this.bloqBody.add(bloqInput);
    this.UIElements.push({
        element: bloqInput,
        elementsToPush: undefined,
        id: inputID,
        connector: this.connections.inputs[this.connections.inputs.length - 1]
    });
};
Bloq.prototype.createBloqUI = function() {
    var margin = 10;
    var posx = margin;
    var width = 0;
    var posy = margin;
    var inputID = 0;
    this.UIElements = [{}];
    var i = 0;
    var j = 0;
    for (j in this.bloqData.text) {
        for (i in this.bloqData.text[j]) {
            if (typeof(this.bloqData.text[j][i]) === typeof({})) {
                if (this.bloqData.text[j][i].input === 'userInput') {
                    this.appendUserInput(this.bloqData.text[j][i].label, this.bloqData.text[j][i].type, posx, posy, this.id + '_' + inputID);
                    inputID += 1;
                    posx += 110;
                } else if (this.bloqData.text[j][i].input === 'bloqInput') {
                    this.appendBloqInput(this.bloqData.text[j][i].label, this.bloqData.text[j][i].type, posx, posy - margin, inputID);
                    inputID += 1;
                    posx += 110;
                } else if (this.bloqData.text[j][i].input === 'dropdown') {
                    this.appendDropdownInput(this.bloqData.text[j][i].data, this.bloqData.text[j][i].type, posx, posy, this.id + '_' + inputID);
                    inputID += 1;
                    posx += 110;
                }
            } else {
                var text = this.bloqBody.text(this.bloqData.text[j][i]).font({
                    family: 'Helvetica',
                    fill: '#000',
                    size: 14
                }).move(posx, posy);
                posx += this.bloqData.text[j][i].length * 5 + 30;
                this.UIElements.push({
                    element: text,
                    elementsToPush: undefined
                });
            }
        }
        if (posx > width) {
            width = posx;
        }
        posx = margin;
        posy += 40;
    }
    this.UIElements.shift();
    //Add the elements that must be pushed
    for (i in this.UIElements) {
        this.UIElements[i].elementsToPush = [{}];
        for (j in this.UIElements) {
            if (j > i) {
                this.UIElements[i].elementsToPush.push({
                    bloq: this.UIElements[j].element,
                    connector: this.UIElements[j].connector
                });
            }
        }
        this.UIElements[i].elementsToPush.shift();
    }
    //Update bloq's size
    this.resize({
        x: width - this.size.width,
        y: posy - this.size.height
    });
};
////////////MOVE BLOQS:
Bloq.prototype.move = function(location) {
    this.bloqBody.x(location.x);
    this.bloqBody.y(location.y);
};
Bloq.prototype.move2 = function(delta) {
    this.bloqBody.x(this.bloqBody.x() + delta.x);
    this.bloqBody.y(this.bloqBody.y() + delta.y);
    this.updateConnectors(delta);
};


Bloq.prototype.moveChildren = function(delta) {
    for (var i in this.relations.children) {
        var child = this.relations.children[i].bloq;
        child.move2(delta);
        if (child.relations !== undefined && child.relations.children !== undefined) {
            child.moveChildren(delta);
        }
    }
};