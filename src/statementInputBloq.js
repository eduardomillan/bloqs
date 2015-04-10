//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: April 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
function StatementInputBloq(bloqData, canvas, position, data, draggable) {
    Bloq.call(this, bloqData, canvas, position, data);
    if (draggable) {
        this.bloqBody.draggable();
    }
    //Down connector x position : +20 px
    this.updateConnector(this.connections.down[0], {
        x: 20,
        y: 0
    });
    //Add bloq's left and down UI parts
    this.bloqBody.downPart = this.bloqBody.rect(this.size.width, 20).fill('#00CC00').radius(4);
    this.bloqBody.downPart.y(80 - 20);
    this.bloqBody.add(this.bloqBody.downPart);
    this.bloqBody.leftPart = this.bloqBody.rect(20, 80).fill('#00CC00').radius(4);
    this.bloqBody.leftPart.size.height = 80;
    this.bloqBody.leftPart.size.width = 20;
    this.bloqBody.add(this.bloqBody.leftPart);
    // Update size:
    this.size = {
        width: this.bloqBody.bbox().width,
        height: this.bloqBody.bbox().height
    };
    this.childrenHeight = this.size.height;
    //Define bloqlabel and add the label on the bloq
    this.label = bloqData.label;
    if (bloqData.statementInput) {
        this.addDownConnector(this.bloqBody.x(), this.bloqBody.y() + this.size.height);
    }
}
StatementInputBloq.prototype = Object.create(Bloq.prototype);
/**
 * Resize a statements input bloq
 * @param delta
 */
StatementInputBloq.prototype.resizeStatementsInput = function(delta) {
    // this.bloqBody.leftPart.size.height += delta.y;
    this.bloqBody.leftPart.height(this.bloqBody.leftPart.size.height);
    this.bloqBody.downPart.move(0, this.bloqBody.downPart.y() + delta.y);
    var diff = this.bloqBody.downPart.y() - this.bloqBody.leftPart.y() + 20;
    this.bloqBody.leftPart.height(diff);
    this.size.height += delta.y;
    //update down connector:
    if (this.connections.down !== undefined && this.connections.down[1] !== undefined) {
        this.moveConnector(this.connections.down[1], {
            x: 0,
            y: delta.y
        });
    }
    // this.moveChildren(delta);
};


StatementInputBloq.prototype.moveConnector = function(connection, delta) {
    //Move connector 
    connection = this.updateConnector(connection, delta);
    //If there is a bloq connected, move the bloq also
    if (connection.bloq !== undefined) {
        var bloqConnected = connection.bloq;
        bloqConnected.move2(delta, true);
    }

};
StatementInputBloq.prototype.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
    return {
        x: this.connections[connectionType][inputID].connectionPosition.x,
        y: this.connections[connectionType][inputID].connectionPosition.y
    };
};
StatementInputBloq.prototype.addDownConnector = function(posx, posy) {
    var index = 0;
    if (this.connections.down !== undefined) {
        index = this.connections.down.length;
    } else {
        this.connections.down = [{}];
    }
    this.connections.down[index] = {
        connectionPosition: {
            x: posx,
            y: posy
        },
        connectorArea: {
            x1: posx,
            x2: posx + connectionThreshold,
            y1: posy - connectionThreshold,
            y2: posy + connectionThreshold
        }
    };
    if (posx !== undefined && posy !== undefined) {
        this.connections.down[index].UI = this.canvas.group().rect(connectionThreshold, connectionThreshold * 2).attr({
            fill: getRandomColor()
        }).move(posx, posy - connectionThreshold);
    }
};