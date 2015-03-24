// @include utils.js
var bloqsNamespace = bloqsNamespace || {};
bloqsNamespace.newBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = canvas.group().move(position[0], position[1]);
    bloq.size = {
        width: 200,
        height: 50
    };
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
    //Create the connectors using the bloq information
    bloq.connections = utils.createConnectors(bloq, bloqData);
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
        bloq.UIElements.push({
            element: text,
            elementsToPush: undefined
        });
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
        var bloqInput = bloq.rect(70, 30).attr({
            fill: '#fff'
        }).move(posx, posy);
        utils.addInput(bloq, bloq.x() + posx, bloq.y() + posy, type); //bloq.x()+posx + width, bloq.x()+posy + i * connectionThreshold);
        bloq.UIElements.push({
            element: bloqInput,
            elementsToPush: undefined,
            id: bloq.connections.inputs.length - 1
        });
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
        bloq.UIElements = [{}];
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
                    posx += bloqData.text[j][i].length * 5 + 30;
                    bloq.UIElements.push({
                        element: text,
                        elementsToPush: undefined
                    });
                }
            }
            if (posx > width) {
                width = posx;
            }
            posx = margin;
            posy += 50;
        }
        bloq.UIElements.shift();
        //Add the elements that must be pushed
        for (var i in bloq.UIElements) {
            bloq.UIElements[i].elementsToPush = [{}];
            // console.log('---->',bloq.UIElements.splice(0, bloq.UIElements.length-i));
            for (var j in bloq.UIElements) {
                if (j > i) {
                    bloq.UIElements[i].elementsToPush.push(bloq.UIElements[j].element);
                }
            }
            bloq.UIElements[i].elementsToPush.shift();
        }
        console.log('triaaaaaaaaaal', bloq.UIElements);
        //Update bloq's size
        utils.resizeBloq(bloq, {
            x: Math.abs(bloq.size.width - width),
            y: Math.abs(bloq.size.height - posy)
        });
    }
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
        if (connectionType === 'up') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x,
                y: bloq.connections[connectionType].connectionPosition.y - bloqToConnect.size.height
            };
        }
        if (connectionType === 'output') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x - bloqToConnect.size.width,
                y: bloq.connections[connectionType].connectionPosition.y - inputID * connectionThreshold
            };
        }
        if (connectionType === 'inputs') {
            console.log('--------------------------------------------------> MOVING DOWN');
            for (var k in bloq.connections[connectionType]) {
                //If the input is inline and there is not a bloq connected still
                if (bloq.connections[connectionType][k].inline === true && bloq.connections[connectionType][k].bloq === undefined && k === inputID) {
                    utils.resizeBloq(bloq, {
                        x: bloqToConnect.size.width,
                        y: 0
                    });
                    for (var i in bloq.UIElements) {
                        if (bloq.UIElements[i].id === parseInt(inputID, 10)) {
                            console.log('here pushing');
                            utils.pushElements(bloq, bloq.UIElements[i].elementsToPush, {
                                x: bloqToConnect.size.width,
                                y: 0
                            });
                            break;
                        }
                    }
                }
                if (k > inputID) {
                    if (bloq.connections[connectionType][k].inline === false && bloq.connections[connectionType][k].movedDown === false) {
                        utils.moveConnector(bloq, bloq.connections[connectionType][k], {
                            x: 0,
                            y: bloqToConnect.size.height - k * connectionThreshold
                        });
                        //The connector has already been moved down once
                        bloq.connections[connectionType][k].movedDown = true;
                        bloq.connections[connectionType][k].movedUp = false;
                    }
                }
            }
            return bloq.connections[connectionType][inputID].connectionPosition;
        }
        return bloq.connections[connectionType].connectionPosition;
    };
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
                console.log('--------------------------------------------------> MOVING UP');
                for (var k in parentBloq.connections.inputs) {
                    if (parentBloq.connections.inputs[k].inline === true && k === parentBloq.relations.children[bloq.id()].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
                        utils.resizeBloq(parentBloq, {
                            x: -bloq.size.width,
                            y: 0
                        });
                        for (var i in parentBloq.UIElements) {
                            console.log('aaaaaaaaa',parentBloq.UIElements[i].id , k);
                            if (parentBloq.UIElements[i].id === parseInt(k,10)) {
                                console.log('here pushing');
                                utils.pushElements(parentBloq, parentBloq.UIElements[i].elementsToPush, {
                                    x: -bloq.size.width,
                                    y: 0
                                });
                                break;
                            }
                        }
                    }
                    if (k > parentBloq.relations.children[bloq.id()].inputID && parentBloq.connections.inputs[k].movedUp === false) {
                        utils.moveConnector(parentBloq, parentBloq.connections.inputs[k], {
                            x: 0,
                            y: -bloq.size.height + k * connectionThreshold
                        });
                        //The connector has already been moved up once
                        parentBloq.connections.inputs[k].movedUp = true;
                        parentBloq.connections.inputs[k].movedDown = false;
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
                                // if (a === true) {
                                //     flag = true;
                                //     break;
                                // }
                            }
                        } else if (j === 'output') {
                            for (var h in data.bloqs[i].connections[utils.oppositeConnection[j]]) {
                                a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]][h], bloq, data.bloqs[i], h);
                                // if (a === true) {
                                //     flag = true;
                                //     break;
                                // }
                            }
                        } else {
                            a = utils.manageConnections(j, bloq.connections[j], data.bloqs[i].connections[utils.oppositeConnection[j]], bloq, data.bloqs[i]);
                        }
                        // if (a === true) {
                        //     flag = true;
                        //     break;
                        // }
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
        for (i in this.relations.inputChildren) {
            if (this.relations.inputChildren[i] === child.node.id) {
                this.relations.inputChildren.splice(i, 1);
                break;
            }
        }
    };
    bloq.setChildren = function(childrenId, location, inputID) {
        for (var bloqIndex in this.relations.children) {
            if (childrenId == this.relations.children[bloqIndex]) {
                // it exists, do nothing
                return false;
            }
        }
        // if we made it so far, add a new child
        bloq.relations.children[childrenId] = {
            bloq: bloq.getBloqById(childrenId),
            connection: location,
            inputID: inputID
        };
        if (location === 'up') {
            this.relations.codeChildren.push(childrenId);
        } else {
            this.relations.inputChildren.push(childrenId);
        }
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
        // console.log('this.relations.inputChildren', this.getBloqById(this.relations.inputChildren));
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