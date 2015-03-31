//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newProjectBloq = function(bloqData, canvas, position, data) {
    "use strict";
    var connectionThreshold = 20; // px
    var bloq = newBloq(bloqData, canvas, position, data);
    //Down connector x position : +20 px
    utils.updateConnector(bloq.connections.down, {
        x: 20,
        y: 0
    });
    //Add bloq's left and down UI parts
    bloq.body.leftPart = bloq.rect(20, 60).fill(bloqData.color).radius(4);
    bloq.body.leftPart.size.width = 20;
    bloq.body.leftPart.size.height = 60;
    bloq.add(bloq.body.leftPart);
    bloq.body.downPart = bloq.rect(bloq.size.width, 20).fill(bloqData.color).radius(4);
    bloq.body.downPart.y(60 - 5);
    bloq.add(bloq.body.downPart);
    //Define bloqlabel and add the label on the bloq
    bloq.label = bloqData.label;
    bloq.text(bloqData.label.toUpperCase()).font({
        family: 'Helvetica',
        fill: '#fff',
        size: 14
    }).move(20, 5);
    /**
     * Resize a statements input bloq
     * @param delta
     */
    bloq.resizeStatementsInput = function(delta) {
        "use strict";
        bloq.body.leftPart.size.height += delta.y;
        console.log('resizeStatementsInput', bloq.body.leftPart.size.height);
        console.log('resizeStatementsInput-->', bloq.body.leftPart.height());
        bloq.body.leftPart.height( bloq.body.leftPart.size.height );
        console.log('resizeStatementsInput-->', bloq.body.leftPart.height());
        bloq.body.downPart.move(0, bloq.body.downPart.y() + delta.y);
    };
    // bloq.resize = bloq.resizeStatementsInput;
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
        // bloqToConnect.getChildrenHeight(true);
        // bloqToConnect.childrenHeight+=bloqToConnect.size.height;
        // console.log('bloqToConnect', bloqToConnect.childrenHeight);
        // bloq.resizeStatementsInput({x:0,y:bloqToConnect.childrenHeight});

        bloqToConnect.resizeParents('down');

        return {
            x: bloq.connections[connectionType].connectionPosition.x,
            y: bloq.connections[connectionType].connectionPosition.y
        };
    };
    return bloq;
};