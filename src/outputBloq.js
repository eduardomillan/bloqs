//----------------------------------------------------------------//
// This file is part of the bloqs Project                         //
//                                                                //
// Date: March 2015                                               //
// Author: Irene Sanz Nieto  <irene.sanz@bq.com>                  //
//----------------------------------------------------------------//
var newOutputBloq = function(bloqData, canvas, position, data) {
    var bloq = new Bloq(bloqData, canvas, position, data); //canvas.group().move(position[0], position[1]);
    //Add the connector to the bloq's UI:
    bloq.body.connector = bloq.path(utils.paths.leftConnector).fill('#cccccc'); //.move(posx, posy);
    bloq.body.connector.x(-8);
    bloq.add(bloq.body.connector);
    bloq.getConnectionPosition = function(connectionType, bloqToConnect, inputID) {
        // connectionType === 'inputs's
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
    };
    return bloq;
};