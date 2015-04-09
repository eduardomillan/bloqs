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
    this.updateConnector(this.connections.down, {
        x: 20,
        y: 0
    });
    //Add bloq's left and down UI parts
    this.bloqBody.leftPart = this.bloqBody.rect(20, 70).fill('#e2e2e2').radius(4);
    this.bloqBody.leftPart.size.height = 70;
    this.bloqBody.leftPart.size.width = 20;
    this.bloqBody.add(this.bloqBody.leftPart);
    this.bloqBody.downPart = this.bloqBody.rect(this.size.width, 20).fill(bloqData.color).radius(4);
    this.bloqBody.downPart.y(70 - 5);
    this.bloqBody.add(this.bloqBody.downPart);
    // Update size:
    this.size = {
        width: this.bloqBody.bbox().width,
        height: this.bloqBody.bbox().height
    };
    this.childrenHeight = this.size.height;
    //Define bloqlabel and add the label on the bloq
    this.label = bloqData.label;
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
    var diff = this.bloqBody.downPart.y() - this.bloqBody.leftPart.y() + 5;
    this.bloqBody.leftPart.height(diff);
    this.size.height += delta.y;
};
StatementInputBloq.prototype.getConnectionPosition = function(connectionType, bloqToConnect) {
    //only if a new child has been added:
    // console.log('this.childrenNumber !== this.relations.children.length',this.childrenNumber, this.relations.children.length, this.childrenNumber !== this.relations.children.length);
    // if (this.childrenNumber !== this.relations.children.length) {
    // bloqToConnect.resizeParents('down');
    // }
    return {
        x: this.connections[connectionType].connectionPosition.x,
        y: this.connections[connectionType].connectionPosition.y
    };
};