//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//

var newOutputBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = newBloq(bloqData, canvas, position, data);  //canvas.group().move(position[0], position[1]);

    //Add the connector to the bloq's UI:
    bloq.body.connector = bloq.path(utils.paths.leftConnector).fill('#cccccc'); //.move(posx, posy);
    bloq.body.connector.x(-8);
    bloq.add(bloq.body.connector);
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