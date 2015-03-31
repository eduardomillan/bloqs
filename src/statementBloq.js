//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newStatementBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = newBloq(bloqData, canvas, position, data);
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
        console.log('getConnectionPosition', connectionType);
        if (connectionType === 'up') {
            return {
                x: bloq.connections[connectionType].connectionPosition.x,
                y: bloq.connections[connectionType].connectionPosition.y - bloqToConnect.size.height
            };
        }
        if (connectionType === 'inputs') {
            for (var k in bloq.connections[connectionType]) {
                //If the input is inline and there is not a bloq connected still
                if (bloq.connections[connectionType][k].inline === true && k === inputID && bloq.connections[connectionType][k].bloq === undefined) {
                    var delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: bloqToConnect.size.height - bloq.bloqInput.height
                    };
                    bloq.resize(delta);
                    delta = {
                        x: bloqToConnect.size.width - bloq.bloqInput.width,
                        y: 0
                    };
                    for (var i in bloq.UIElements) {
                        if (bloq.UIElements[i].id === parseInt(inputID, 10)) {
                            utils.pushElements(bloq, bloq.UIElements[i], delta);
                            break;
                        }
                    }
                }
            }
            return bloq.connections[connectionType][inputID].connectionPosition;
        }
        if (connectionType === 'down') {
            bloqToConnect.resizeParents('down');
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
            if (parentBloq.relations.children[bloq.id()].connection === 'up') {
                console.log('uuuuuuuuuuuuuuuuuup');
                bloq.resizeParents('up');
            } else if (parentBloq.relations.children[bloq.id()].connection === 'output') {
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
    return bloq;
};