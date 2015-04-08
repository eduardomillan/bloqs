//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
function ProjectBloq(bloqData, canvas, position, data) {
    Bloq.call(this, bloqData, canvas, position, data);
    //Down connector x position : +20 px
    this.updateConnector(this.connections.down, {
        x: 20,
        y: 0
    });
    //Add bloq's left and down UI parts
    this.bloqBody.leftPart = this.bloqBody.rect(20, 60).fill('#e2e2e2').radius(4);
    this.bloqBody.leftPart.size.width = 20;
    this.bloqBody.leftPart.size.height = 60;
    this.bloqBody.add(this.bloqBody.leftPart);
    this.bloqBody.downPart = this.bloqBody.rect(this.size.width, 20).fill(bloqData.color).radius(4);
    this.bloqBody.downPart.y(60 - 5);
    this.bloqBody.add(this.bloqBody.downPart);
    //Define bloqlabel and add the label on the bloq
    this.label = bloqData.label;
    this.bloqBody.text(bloqData.label.toUpperCase()).font({
        family: 'Helvetica',
        fill: '#fff',
        size: 14
    }).move(20, 5);
}
ProjectBloq.prototype = Object.create(Bloq.prototype);
/**
 * Resize a statements input bloq
 * @param delta
 */
ProjectBloq.prototype.resizeStatementsInput = function(delta) {
    // this.bloqBody.leftPart.size.height += delta.y;
    this.bloqBody.leftPart.height(this.bloqBody.leftPart.size.height);
    this.bloqBody.downPart.move(0, this.bloqBody.downPart.y() + delta.y);
    var diff = this.bloqBody.downPart.y() - this.bloqBody.leftPart.y();
    this.bloqBody.leftPart.height(diff);
};
// bloq.resize = bloq.resizeStatementsInput;
ProjectBloq.prototype.getConnectionPosition = function(connectionType, bloqToConnect) {
    // if (bloqToConnect.bloqBody.relations.codeChildren.length === 0) {
    //     console.log('************************************************** CHIVATO *********************************************************')
    //     bloqToConnect.childrenHeight = bloqToConnect.size.height;
    // }
    bloqToConnect.resizeParents('down');
    return {
        x: this.connections[connectionType].connectionPosition.x,
        y: this.connections[connectionType].connectionPosition.y
    };
};