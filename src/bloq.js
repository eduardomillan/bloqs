// @include utils.js
var bloqsNamespace = bloqsNamespace || {};
bloqsNamespace.newBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = canvas.group().move(position[0], position[1]);
    bloq.size = {
        width: bloqData.size[0],
        height: bloqData.size[1]
    };
    console.log('bloqdata.size', bloqData.size);
    bloq.delta = {
        x: 0,
        y: 0,
        lastx: 0,
        lasty: 0
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
    /**
     * Set this bloq as draggable
     */
    if (bloq.label !== 'setup' && bloq.label !== 'loop') {
        bloq.draggable();
    }
    bloq.appendUserInput = function(inputText, type, posx, posy, id) {
        var text = bloq.foreignObject(100, 100).attr({
            id: 'fobj',
            color: '#FFCC33'
        });
        text.appendChild("input", {
            id: id,
            value: inputText,
            color: '#FFCC33',
        }).move(posx, posy);
        document.getElementById(id).addEventListener("mousedown", function(e) {
            e.stopPropagation();
        }, false);
        //Check that the input of the user is the one spected
        document.getElementById(id).addEventListener("change", function() {
            if (type === 'number') {
                if (isNaN(parseFloat(document.getElementById(id).value))) {
                    //If type is number and input is not a number, remove user input. 
                    //ToDo : UX warning!
                    document.getElementById(id).value = '';
                }
            }
        }, false);
    };
    bloq.appendBloqInput = function(inputText, type, posx, posy, id) {
        //draw white (ToDo: UX) rectangle
        var width = posx;
        var bloqInput = bloq.rect(70, 30).attr({
            fill: '#fff'
        }).move(width, posy);
        // if (bloq.connections.inputs === undefined) {
        //     bloq.connections.inputs = [{
        //         connectorArea: undefined,
        //         type: ''
        //     }];
        // }
        //add connector (input, type)
        // bloq.connections.inputs.push({
        //     connectionPosition: {
        //         x: bloqInput.x(),
        //         y: bloqInput.y()
        //     },
        //     connectorArea: {
        //         x1: posx + width - connectionThreshold,
        //         x2: posx + width,
        //         y1: posy + i * connectionThreshold,
        //         y2: posy + (1 + i) * connectionThreshold
        //     },
        //     type: type
        // });
        // bloq.inputsNumber = bloq.connections.inputs.length;
        // console.log('after:', bloq.connections.inputs);
    };
    bloq.body = bloq.rect(bloq.size.width, bloq.size.height).fill(bloqData.color).radius(10);
    bloq.border = bloq.rect(bloq.size.width, bloq.size.height).fill('none').stroke({
        width: 1
    }).radius(10);
    bloq.selection = bloq.rect(bloq.size.width, bloq.size.height).fill('none').stroke({
        width: 3,
        color: '#FFCC33'
    }).radius(10).hide();
    if (bloqData.hasOwnProperty('label') && bloqData.label !== '') {
        bloq.label = bloqData.label;
        bloq.text(bloqData.label.toUpperCase()).font({
            family: 'Helvetica',
            fill: '#fff',
            size: 14
        }).move(10, 5);
    } else {
        bloq.label = '';
    }
    if (bloqData.hasOwnProperty('text')) {
        var margin = 10;
        var posx = margin;
        var width = 0;
        var posy = margin;
        for (var j in bloqData.text) {
            for (var i in bloqData.text[j]) {
                if (typeof(bloqData.text[j][i]) === typeof({})) {
                    if (bloqData.text[j][i].input === 'userInput') {
                        bloq.appendUserInput(bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy, i);
                        posx += 110;
                    } else if (bloqData.text[j][i].input === 'bloqInput') {
                        bloq.appendBloqInput(bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy, i);
                        posx += 110;
                    }
                } else {
                    var text = bloq.text(bloqData.text[j][i]).font({
                        family: 'Helvetica',
                        fill: '#fff',
                        size: 14
                    }).move(posx, posy);
                    posx += text.width() + 30;
                }
            }
            if (posx > width) {
                width = posx;
            }
            posx = margin;
            posy += 50;
        }
        //UPDATE all positions depending on inputs
        bloq.body.size(width, posy);
        bloq.border.size(width, posy);
        bloq.selection.size(width, posy);
        //UPDATE bloq sizes
        bloq.size.width = width;
        bloq.size.height = posy;
    }
    //Create the connectors using the bloq information
    bloq.connections = utils.createConnectors(bloq, bloqData);
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputsId) {
        if (connectionType === 'up') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x,
                y: bloq.connections[connectionType].connectionPosition.y - bloqToConnect.size.height
            };
        }
        if (connectionType === 'output') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x - bloqToConnect.size.width,
                y: bloq.connections[connectionType].connectionPosition.y
            };
        }
        if (connectionType === 'inputs') {
            return bloq.connections[connectionType][inputsId].connectionPosition;
        }
        return bloq.connections[connectionType].connectionPosition;
    };
    /**
     * We start dragging
     */
    bloq.dragmove = function(a) {
        //Update the deltaX and deltaY movements
        bloq.delta.x = a.x - bloq.delta.lastx;
        bloq.delta.y = a.y - bloq.delta.lasty;
        //Update the lastx and lasty variables
        bloq.delta.lastx = a.x;
        bloq.delta.lasty = a.y;
        //Update the bloq's connectors using the new deltas
        bloq.connections = utils.updateConnectors(bloq);
        //move dragged bloq on top
        bloq.node.parentNode.appendChild(bloq.node);
        // remove parent of this and child in parent:
        if (bloq.relations.parent !== undefined) {
            bloq.getBloqById(bloq.relations.parent).deleteChild(bloq);
            bloq.deleteParent(true);
        }
        // move child bloqs along with this one
        // for (var i in movedBloq.relations.children) {
        //     var childBloq = movedBloq.getBloqById(movedBloq.relations.children[i]);
        //     var parentBloq = movedBloq;
        //     var connectorArea = childBloq.connectorArea;
        //     this.connectBloqs(parentBloq, childBloq, connectorArea);
        // }
    };
    /**
     * We stop dragging
     */
    bloq.dragend = function() {
        //Initialize lasx y laxy
        bloq.delta.lastx = 0;
        bloq.delta.lasty = 0;
        // console.log('DRAGEND +++++++++++++++++++++++++++++++');
        // console.log('bloq connectorArea :', bloq.x(), bloq.y());
        // console.log('connectors[up,down]connectorArea', bloq.connections.up.connectorArea, bloq.connections.down.connectorArea);
        // console.log('connectors[up,down]connectionPosition', bloq.connections.up.connectionPosition, bloq.connections.down.connectionPosition);
        var flag = false;
        for (var j in bloq.connections) {
            if (flag === true) {
                break;
            }
            console.log('Searching connection in bloqs connection:++++++++++++++++++++++++++++++++++', j);
            for (var i in data.bloqs) {
                if (data.bloqs[i].node.id !== bloq.node.id) {
                    var a = bloq.manageConnections(j, data.bloqs[i], false);
                    if (a === true) {
                        flag = true;
                        break; //propagate break!
                    }
                }
            }
        }
        console.log('-----------------------------------------------------------------------');
    };
    bloq.manageConnections = function(type, connectingBloq) {
        var connectingBloqLocation = utils.oppositeConnection[type];
        if (connectingBloqLocation === 'inputs') {
            if (connectingBloq.connections[connectingBloqLocation] !== undefined && this.connections[type] !== undefined) {
                for (var i in connectingBloq.connections[connectingBloqLocation]) {
                    if (bloq.connections[type].type === connectingBloq.connections[connectingBloqLocation][i].type) { // if the type is the same
                        if (bloq.itsOver(bloq.connections[type].connectorArea, connectingBloq.connections[connectingBloqLocation][i].connectorArea)) {
                            console.log('isover!! ---> ', type);
                            bloq.delta.x = connectingBloq.connections[connectingBloqLocation][i].connectorArea.x1 - bloq.connections[type].connectorArea.x1;
                            bloq.delta.y = connectingBloq.connections[connectingBloqLocation][i].connectorArea.y1 - bloq.connections[type].connectorArea.y1;
                            // console.log('connectingBloq.getConnectionPosition(connectingBloqLocation, bloq)',connectingBloq.getConnectionPosition(connectingBloqLocation, bloq));
                            utils.moveBloq(bloq, connectingBloq.getConnectionPosition(connectingBloqLocation, bloq, i));
                            bloq.connections = utils.updateConnectors(bloq);
                            bloq.delta.lastx = 0;
                            bloq.delta.lasty = 0;
                            return true;
                        } else {
                            console.log('not over');
                            console.log('conectors location:', connectingBloq.connections[connectingBloqLocation].connectorArea, bloq.connections[type].connectorArea);
                        }
                    }
                }
            }
        } else {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa', bloq.connections[type].type);
            if (connectingBloq.connections[connectingBloqLocation] !== undefined && bloq.connections[type] !== undefined) {
                if (type === 'inputs') {
                    for (var k in bloq.connections[type]) {
                        if (bloq.connections[type][k].type === connectingBloq.connections[connectingBloqLocation].type) { // if the type is the same
                            if (bloq.itsOver(bloq.connections[type][k].connectorArea, connectingBloq.connections[connectingBloqLocation].connectorArea)) {
                                console.log('isover!! ---> ', type);
                                bloq.delta.x = connectingBloq.connections[connectingBloqLocation].connectorArea.x1 - bloq.connections[type][k].connectorArea.x1;
                                bloq.delta.y = connectingBloq.connections[connectingBloqLocation].connectorArea.y1 - bloq.connections[type][k].connectorArea.y1;
                                utils.moveBloq(bloq, connectingBloq.getConnectionPosition(connectingBloqLocation, bloq));
                                bloq.connections = utils.updateConnectors(bloq);
                                bloq.delta.lastx = 0;
                                bloq.delta.lasty = 0;
                                return true;
                            }
                        }
                    }
                }
            } else {
                if (bloq.connections[type].type === connectingBloq.connections[connectingBloqLocation].type) { // if the type is the same
                    if (bloq.itsOver(bloq.connections[type].connectorArea, connectingBloq.connections[connectingBloqLocation].connectorArea)) {
                        console.log('isover!! ---> ', type);
                        // console.log('moving to :', connectingBloq.connections[connectingBloqLocation].connectionPosition);
                        // console.log('conectors location BEFORE UPDATE:', connectingBloq.connections[connectingBloqLocation].connectorArea, bloq.connections[type].connectorArea);
                        // console.log('conectors connectionPosition BEFORE UPDATE:', connectingBloq.connections[connectingBloqLocation].connectionPosition, bloq.connections[type].connectionPosition);
                        bloq.delta.x = connectingBloq.connections[connectingBloqLocation].connectorArea.x1 - bloq.connections[type].connectorArea.x1;
                        bloq.delta.y = connectingBloq.connections[connectingBloqLocation].connectorArea.y1 - bloq.connections[type].connectorArea.y1;
                        // console.log('aaa',connectingBloq.getConnectionPosition(connectingBloqLocation, bloq));
                        // var positionX = connectingBloq.connections[connectingBloqLocation].connectionPosition.x;
                        // var positionY = connectingBloq.connections[connectingBloqLocation].connectionPosition.y;
                        // if (type === 'down'){
                        //     positionY-=bloq.size.height;
                        // }
                        // console.log('aaa',positionX, positionY);
                        // utils.moveBloq(bloq, {x:positionX, y:positionY});
                        utils.moveBloq(bloq, connectingBloq.getConnectionPosition(connectingBloqLocation, bloq));
                        // console.log('deltas:', bloq.delta.x, bloq.delta.y, connectingBloq.delta.x, connectingBloq.delta.y);
                        bloq.connections = utils.updateConnectors(bloq);
                        bloq.delta.lastx = 0;
                        bloq.delta.lasty = 0;
                        // console.log('ids:', bloq.node.id, connectingBloq.node.id);
                        // console.log('conectors location AFTER UPDATE: connectingBloq, this:', connectingBloq.connections[connectingBloqLocation].connectorArea, bloq.connections[type].connectorArea);
                        // console.log('conectors connectionPosition AFTER UPDATE:connectingBloq, this:', connectingBloq.connections[connectingBloqLocation].connectionPosition, bloq.connections[type].connectionPosition);
                        return true;
                    } else {
                        console.log('not over');
                        console.log('conectors location:', connectingBloq.connections[connectingBloqLocation].connectorArea, bloq.connections[type].connectorArea);
                    }
                }
            }
        }
        return false;
    };
    bloq.updateBloqs = function(parent, child) {
        parent.setChildren(child.node.id, child.connectorArea);
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
        for (var i in this.relations.children) {
            if (this.relations.children[i] === child.node.id) {
                this.relations.children.splice(i, 1);
                break;
            }
        }
        for (i in this.relations.codeChildren) {
            if (this.relations.codeChildren[i] === child.node.id) {
                this.relations.codeChildren.splice(i, 1);
                break;
            }
        }
        for (i in this.relations.inputChildren) {
            if (this.relations.inputChildren[i] === child.node.id) {
                this.relations.inputChildren.splice(i, 1);
                break;
            }
        }
    };
    bloq.setChildren = function(childrenId, location) {
        for (var bloqIndex in this.relations.children) {
            if (childrenId == this.relations.children[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
        // if we made it so far, add a new child
        this.relations.children.push(childrenId);
        if (location === 'up') {
            this.relations.codeChildren.push(childrenId);
        } else {
            this.relations.inputChildren.push(childrenId);
        }
        return true;
    };
    bloq.setParent = function(parentId) {
        this.relations.parent = parentId;
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
        console.log('this.relations.inputChildren', this.getBloqById(this.relations.inputChildren));
        for (var i in this.relations.inputChildren) {
            replacement = this.getBloqById(this.relations.inputChildren).getCode(_function);
            search = '{[' + i + ']}';
            code = code.replace(new RegExp(search, 'g'), replacement);
        }
        for (i = 0; i < this.inputsNumber; i++) {
            search = '{[' + i + ']}';
            code = code.replace(new RegExp(search, 'g'), ' ');
        }
        return code;
    };
    bloq.on('click', function() {
        if (this.label.toLowerCase() != 'loop' && this.label.toLowerCase() != 'setup') {
            // remove other borders
            var canvasChilds = canvas.children();
            $.each(canvasChilds, function(index) {
                if (canvasChilds[index].hasOwnProperty('border')) {
                    // hide selection
                    canvasChilds[index].selection.hide();
                }
            });
            this.selection.show();
        }
    });
    return bloq;
};