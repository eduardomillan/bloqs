var newStatementBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = newBloq(bloqData, canvas, position, data);  //canvas.group().move(position[0], position[1]);
    // bloq.size = {
    //     width: 100,
    //     height: 50
    // };
    // bloq.delta = {
    //     x: 0,
    //     y: 0,
    //     lastx: 0,
    //     lasty: 0
    // };
    // bloq.bloqInput = {
    //     width: 70,
    //     height: 50
    // };
    // bloq.code = bloqData.code;
    // if (bloqData.hasOwnProperty('factoryCode')) {
    //     bloq.factoryCode = bloqData.factoryCode;
    // } else {
    //     bloq.factoryCode = '';
    // }
    // /**
    //  * We store relations here, using nodes
    //  * @type {{parent: undefined, children: Array}}
    //  */
    // bloq.relations = {
    //     parent: undefined,
    //     children: [],
    //     codeChildren: [],
    //     inputChildren: []
    // };
    // /**
    //  * Set this bloq as draggable
    //  */
    // if (bloq.label !== 'setup' && bloq.label !== 'loop') {
    //     bloq.draggable();
    // }
    // //Create the connectors using the bloq information
    // bloq.connections = utils.createConnectors(bloq, bloqData);
    // // basic path (shape) for bloq
    // if (bloqData.output) {
    //     bloq.body = utils.getOutputBloq(bloq, 0, bloq.size.width, bloq.size.height);
    // } else {
    //     bloq.body = bloq.rect(bloq.size.width, bloq.size.height).fill(bloqData.color).radius(4);
    // }
    // // bloq.border = bloq.path(path).fill(bloqData.color).hide(); // give a hidden 'body' to the border path
    // // bloq.border.stroke({
    // //     color: '#e5a33b',
    // //     width: 3
    // // });
    // bloq.size = {
    //     width: bloq.bbox().width,
    //     height: bloq.bbox().height
    // };
    // if (bloqData.hasOwnProperty('label') && bloqData.label !== '') {
    //     bloq.label = bloqData.label;
    //     bloq.text(bloqData.label.toUpperCase()).font({
    //         family: 'Helvetica',
    //         fill: '#fff',
    //         size: 14
    //     }).move(10, 5);
    // } else {
    //     bloq.label = '';
    // }
    // if (bloqData.hasOwnProperty('text')) {
    //     utils.createBloqUI(bloq, bloqData);
    // }
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
                if (bloq.connections[connectionType][k].inline === true && k === inputID && bloq.connections[connectionType][k].bloq === undefined) {
                    var delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: bloqToConnect.size.height - bloq.bloqInput.height
                    };
                    utils.resizeBloq(bloq, delta);
                    delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: 0
                    };
                    for (var i in bloq.UIElements) {
                        if (bloq.UIElements[i].id === parseInt(inputID, 10)) {
                            console.log('here pushing', bloq.UIElements[i].elementsToPush);
                            utils.pushElements(bloq, bloq.UIElements[i], delta);
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
                        var delta = {
                            x: -bloq.size.width + parentBloq.bloqInput.width,
                            y: -bloq.size.height + parentBloq.bloqInput.height
                        };
                        // var delta = {
                        //     x: -bloq.size.width + bloq.bloqInput.width,
                        //     y: -parentBloq.size.height + bloq.bloqInput.height
                        // };
                        utils.resizeBloq(parentBloq, delta);
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
    return bloq;
};