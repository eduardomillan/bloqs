//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var StatementBloq = function(bloqData, canvas, position, data) {
    Bloq.call(this, bloqData, canvas, position, data);
    this.bloqBody.dragmove = StatementBloq.prototype.dragmove;
};
StatementBloq.prototype = Object.create(Bloq.prototype);

StatementBloq.prototype.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
    if (connectionType === 'up') {
        return {
            x: this.bloqBody.connections[connectionType].connectionPosition.x,
            y: this.bloqBody.connections[connectionType].connectionPosition.y - bloqToConnect.size.height
        };
    }
    if (connectionType === 'output') {
        return {
            x: this.bloqBody.connections[connectionType].connectionPosition.x - bloqToConnect.size.width,
            y: this.bloqBody.connections[connectionType].connectionPosition.y - inputID * connectionThreshold
        };
    }
    if (connectionType === 'inputs') {
        console.log('--------------------------------------------------> MOVING DOWN');
        for (var k in this.bloqBody.connections[connectionType]) {
            //If the input is inline and there is not a bloq connected still
            if (this.bloqBody.connections[connectionType][k].inline === true && k === inputID && this.bloqBody.connections[connectionType][k].bloq === undefined) {
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
        return this.bloqBody.connections[connectionType][inputID].connectionPosition;
    }
        if (connectionType === 'down') {
        bloqToConnect.resizeParents('down');
    }
    return this.bloqBody.connections[connectionType].connectionPosition;
};

/**
 * We start dragging
 */
StatementBloq.prototype.dragmove = function(a) {
    this.dragmoveFlag = true;
    // remove parent of this and child in parent:
    if (this.relations.parent !== undefined) {
        //move dragged bloq on top
        utils.bloqOnTop(this.bloqBody);
        var parentBloq = utils.getBloqById(this.relations.parent, this.data);
        if (parentBloq.bloqBody.relations.children[this.getBloqObject().id].connection === 'up') {
            console.log('resizing parents in StatementBloq', this.getBloqObject().childrenHeight);
            this.getBloqObject().resizeParents('up');
        }
        else if (parentBloq.bloqBody.relations.children[this.getBloqObject().id].connection === 'output') {
            for (var k in parentBloq.bloqBody.connections.inputs) {
                if (parentBloq.bloqBody.connections.inputs[k].inline === true && k === parentBloq.bloqBody.relations.children[this.getBloqObject().id].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
                    var delta = {
                        x: +this.getBloqObject().size.width - parentBloq.size.width,
                        y: +this.getBloqObject().size.height - parentBloq.size.height
                    };
                    parentBloq.resize(delta);
                    delta = {
                        x: this.getBloqObject().size.width - parentBloq.size.width,
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
        parentBloq.deleteChild(this.getBloqObject());
        this.getBloqObject().deleteParent(false);
    }
    //Update the deltaX and deltaY movements
    this.delta.x = a.x - this.delta.lastx;
    this.delta.y = a.y - this.delta.lasty;
    //Update the lastx and lasty variables
    this.delta.lastx = a.x;
    this.delta.lasty = a.y;
    //Update the bloq's connectors using the new deltas
    this.connections = utils.updateConnectors(this.getBloqObject(), this.delta);
    // move child bloqs along with this one
    utils.moveChildren(this.getBloqObject(), this.delta);
};
/**
 * We start dragging
 */
// bloq.dragmove = function(a) {
//     bloq.dragmoveFlag = true;
//     // remove parent of this and child in parent:
//     if (bloq.relations.parent !== undefined) {
//         //move dragged bloq on top
//         utils.bloqOnTop(bloq);
//         var parentBloq = bloq.getBloqById(bloq.relations.parent);
//         if (parentBloq.relations.children[bloq.id()].connection === 'up') {
//             bloq.resizeParents('up');
//         } else if (parentBloq.relations.children[bloq.id()].connection === 'output') {
//             for (var k in parentBloq.connections.inputs) {
//                 if (parentBloq.connections.inputs[k].inline === true && k === parentBloq.relations.children[bloq.id()].inputID) { //&& bloq.connections[connectionType][k].bloq === undefined) {
//                     var delta = {
//                         x: -bloq.size.width + parentBloq.bloqInput.width,
//                         y: -bloq.size.height + parentBloq.bloqInput.height
//                     };
//                     parentBloq.resize(delta);
//                     delta = {
//                         x: -bloq.size.width + parentBloq.bloqInput.width,
//                         y: 0
//                     };
//                     for (var i in parentBloq.UIElements) {
//                         if (parentBloq.UIElements[i].id === parseInt(k, 10)) {
//                             utils.pushElements(parentBloq, parentBloq.UIElements[i], delta);
//                             break;
//                         }
//                     }
//                 }
//             }
//         }
//         parentBloq.deleteChild(bloq);
//         bloq.deleteParent(false);
//     }
//     //Update the deltaX and deltaY movements
//     bloq.delta.x = a.x - bloq.delta.lastx;
//     bloq.delta.y = a.y - bloq.delta.lasty;
//     //Update the lastx and lasty variables
//     bloq.delta.lastx = a.x;
//     bloq.delta.lasty = a.y;
//     //Update the bloq's connectors using the new deltas
//     bloq.connections = utils.updateConnectors(bloq, bloq.delta);
//     // move child bloqs along with this one
//     utils.moveChildren(bloq, bloq.delta);
// };