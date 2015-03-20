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
    console.log('bloqdata.size',bloqData.size);
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
        //         location: undefined,
        //         type: ''
        //     }];
        // }
        //add connector (input, type)
        // bloq.connections.inputs.push({
        //     positionInBloq: {
        //         x: bloqInput.x(),
        //         y: bloqInput.y()
        //     },
        //     location: {
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

    bloq.connections = utils.createConnectors(bloq, bloqData);
    console.log('initially : ', bloq.node.id, bloq.connections.up.positionInBloq, bloq.connections.down.positionInBloq);


    bloq.getConnectionPosition = function (connectionType, bloqToConnect){

        if (connectionType==='up'){
            return {x : bloq.connections[connectionType].positionInBloq.x, y:bloq.connections[connectionType].positionInBloq.y - bloqToConnect.size.height}
        }
        return bloq.connections[connectionType].positionInBloq;
    };

    /**
     * We start dragging
     */
    bloq.dragmove = function(a, e) {
        // console.log('--------------------------------------> delta.lastx, delta.lasty', bloq.delta.lastx, bloq.delta.lasty);
        bloq.delta.x = a.x - bloq.delta.lastx; //e.movementX;
        bloq.delta.y = a.y - bloq.delta.lasty; //e.movementY;
        bloq.delta.lastx = a.x;
        bloq.delta.lasty = a.y;
        // console.log('DRAGMOVE +++++++++++++++++++++++++  deltax, deltay', bloq.node.id, bloq.delta.x, bloq.delta.y);
        bloq.connections = utils.updateConnectors(bloq);
        // console.log('DRAGMOVE +++++++++++++++++++++++++connectors[up,down]location', bloq.connections.up.location, bloq.connections.down.location);
        // console.log('connectors[up,down]positionInBloq', bloq.connections.up.positionInBloq, bloq.connections.down.positionInBloq);
        // console.log('bloq location :', bloq.x(), bloq.y());
        //move dragged bloq on top
        bloq.node.parentNode.appendChild(bloq.node);
        var movedBloq = this;
        // remove parent of this and child in parent:
        if (movedBloq.relations.parent !== undefined) {
            movedBloq.getBloqById(movedBloq.relations.parent).deleteChild(movedBloq);
            movedBloq.deleteParent(true);
        }
        // move child bloqs along with this one
        // for (var i in movedBloq.relations.children) {
        //     var childBloq = movedBloq.getBloqById(movedBloq.relations.children[i]);
        //     var parentBloq = movedBloq;
        //     var location = childBloq.location;
        //     this.connectBloqs(parentBloq, childBloq, location);
        // }
    };
    /**
     * We stop dragging
     */
    bloq.dragend = function(a, e) {
        //Initialize lasx y laxy
        bloq.delta.lastx = 0;
        bloq.delta.lasty = 0;
        // console.log('DRAGEND +++++++++++++++++++++++++++++++');
        // console.log('bloq location :', bloq.x(), bloq.y());
        // console.log('connectors[up,down]location', bloq.connections.up.location, bloq.connections.down.location);
        // console.log('connectors[up,down]positionInBloq', bloq.connections.up.positionInBloq, bloq.connections.down.positionInBloq);
        var flag = false;
        for (var j in bloq.connections) {
            if (flag === true) {
                break;
            }
            console.log('Searching connection in bloqs connection:++++++++++++++++++++++++++++++++++', j);
            if (bloq.connections[j] !== undefined) {
                for (var i in data.bloqs) {
                    if (data.bloqs[i].node.id !== bloq.node.id) {
                        if (bloq.manageConnections(j, data.bloqs[i], false) === true) {
                            flag = true;
                            break; //propagate break!
                        }
                    }
                }
            }
        }
    };
    bloq.manageConnections = function(type, connectingBloq) {
        var connectingBloqLocation = utils.oppositeConnection[type];
        // if (connectingBloqLocation === 'inputs') {
        //     if (connectingBloq.connections[connectingBloqLocation] !== undefined && this.connections[type] !== undefined) {
        //         for (var i in connectingBloq.connections[connectingBloqLocation]) {
        //             console.log('aaaaaaaaaaaa', this.connections[type], connectingBloq.connections[connectingBloqLocation][i]);
        //             if (this.connections[type].type === connectingBloq.connections[connectingBloqLocation][i].type) { // if the type is the same
        //                 if (this.itsOver(this.connections[type].location, connectingBloq.connections[connectingBloqLocation][i].location)) {
        //                     console.log('connectingBloq.connections[connectingBloqLocation][i].positionInBloq', connectingBloq.connections[connectingBloqLocation][i]);
        //                     utils.moveBloq(this, connectingBloq.connections[connectingBloqLocation][i].positionInBloq);
        //                     this.updateConnectors();
        //                     connectingBloq.updateConnectors();
        //                     console.log('INPUT : isover!!');
        //                 } else {
        //                     console.log('INPUT: not over');
        //                 }
        //             }
        //         }
        //     }
        // } else {
        if (connectingBloq.connections[connectingBloqLocation] !== undefined && bloq.connections[type] !== undefined && bloq.connections[type].type === connectingBloq.connections[connectingBloqLocation].type) { // if the type is the same
            if (bloq.itsOver(bloq.connections[type].location, connectingBloq.connections[connectingBloqLocation].location)) {
                console.log('isover!! ---> ', type);
                // console.log('moving to :', connectingBloq.connections[connectingBloqLocation].positionInBloq);
                // console.log('conectors location BEFORE UPDATE:', connectingBloq.connections[connectingBloqLocation].location, bloq.connections[type].location);
                // console.log('conectors positionInBloq BEFORE UPDATE:', connectingBloq.connections[connectingBloqLocation].positionInBloq, bloq.connections[type].positionInBloq);
                bloq.delta.x = connectingBloq.connections[connectingBloqLocation].location.x1 - bloq.connections[type].location.x1;
                bloq.delta.y = connectingBloq.connections[connectingBloqLocation].location.y1 - bloq.connections[type].location.y1;
                // console.log('aaa',connectingBloq.getConnectionPosition(connectingBloqLocation, bloq));
                // var positionX = connectingBloq.connections[connectingBloqLocation].positionInBloq.x;
                // var positionY = connectingBloq.connections[connectingBloqLocation].positionInBloq.y;
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
                // console.log('conectors location AFTER UPDATE: connectingBloq, this:', connectingBloq.connections[connectingBloqLocation].location, bloq.connections[type].location);
                // console.log('conectors positionInBloq AFTER UPDATE:connectingBloq, this:', connectingBloq.connections[connectingBloqLocation].positionInBloq, bloq.connections[type].positionInBloq);
                return true;
            } else {
                console.log('not over');
                console.log('conectors location:', connectingBloq.connections[connectingBloqLocation].location, bloq.connections[type].location);
            }
            // }
        }
        return false;
    };
    bloq.updateBloqs = function(parent, child) {
        parent.setChildren(child.node.id, child.location);
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