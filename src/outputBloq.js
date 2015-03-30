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

    return bloq;
};