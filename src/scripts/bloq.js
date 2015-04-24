/*global require */
/*jshint latedef: false */
'use strict';

var $ = require('jquery'),
    utils = require('./utils'),
    _ = require('lodash'),
    connectors = {},
    IOConnectors = {},
    bloqs = {},
    availableConnectors = [],
    availableIOConnectors = [];


var dragstart = function(evt) {


    //$(evt.currentTarget).css('transition', 'none');
    // console.log('dragstart');
    var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];
    console.log('dragstart', bloq.uuid);
    evt.stopPropagation();

    // console.log(bloq);

    //transparent
    evt.originalEvent.dataTransfer.setDragImage(document.getElementById('empty'), 0, 0);

    var mousePosition = utils.getMousePosition(evt.currentTarget);

    evt.currentTarget.setAttribute('data-drag-mouseX', (evt.originalEvent.pageX - mousePosition.x));
    evt.currentTarget.setAttribute('data-drag-mouseY', (evt.originalEvent.pageY - mousePosition.y));

    switch (bloq.bloqData.type) {
        case 'statement':
            statementDragStart(bloq);
            break;
        case 'output':
            outputDragStart(bloq);
            console.log('output bloq');
            break;
        default:
            throw 'Not defined bloq dragstart!!';
    }

};

var statementDragStart = function(bloq) {
    var acceptTypes = [];

    //first connector
    acceptTypes = acceptTypes.concat(connectors[bloq.connectors[0]].data.accept);
    //las Children Connector
    acceptTypes = acceptTypes.concat(connectors[getLastBottomConnectorUuid(bloq.uuid)].data.accept);



    if (connectors[bloq.connectors[0]].connectedTo) {
        connectors[connectors[bloq.connectors[0]].connectedTo].connectedTo = null;
        connectors[bloq.connectors[0]].connectedTo = null;
    }

    //console.log('height', getTreeHeight(bloq.uuid));

    //store the available connectors
    var notAvailableConnectors = getBranchsConnectors(bloq.uuid);
    var totalConectorsUuids = _.keys(connectors);
    availableConnectors = _.difference(totalConectorsUuids, notAvailableConnectors);


    //bloq.$bloq.addClass('');
    for (var i = 0; i < notAvailableConnectors.length; i++) {
        bloqs[connectors[notAvailableConnectors[i]].bloqUuid].$bloq.addClass('dragging');
    }

    //console.log(availableConnectors);
    //console.log(notAvailableConnectors);
};

var outputDragStart = function(bloq) {
    // les desconectamos de donde este
    var outputConnector = getOutputConnector(bloq, IOConnectors);
    if (outputConnector.connectedTo) {
        bloq.$bloq.removeClass('nested-bloq');
        IOConnectors[outputConnector.connectedTo].connectedTo = null;
        outputConnector.connectedTo = null;
        $('#field').append(bloq.$bloq);
    }

    //store the available connectors
    var notAvailableConnectors = getInputsConnectors(bloqs[bloq.uuid]);
    var totalConectorsUuids = _.keys(IOConnectors);
    availableIOConnectors = _.difference(totalConectorsUuids, notAvailableConnectors);

};

var getInputsConnectors = function(bloq) {
    //TODO:buscar entre sus hijos si tiene conectadas cosicas
    return bloq.IOConnectors;
};

var getLastBottomConnectorUuid = function(bloqUuid) {
    if (connectors[bloqs[bloqUuid].connectors[1]].connectedTo) {
        return getLastBottomConnectorUuid(connectors[connectors[bloqs[bloqUuid].connectors[1]].connectedTo].bloqUuid);
    } else {
        return bloqs[bloqUuid].connectors[1];
    }
};

var getFirstTopConnectorUuid = function(bloqUuid) {
    if (connectors[bloqs[bloqUuid].connectors[0]].connectedTo) {
        return getFirstTopConnectorUuid(connectors[connectors[bloqs[bloqUuid].connectors[0]].connectedTo].bloqUuid);
    } else {
        return bloqs[bloqUuid].connectors[0];
    }
};

var getBranchsConnectors = function(bloqUuid) {
    var bloq = bloqs[bloqUuid];
    //console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
    if (!connectors[bloq.connectors[1]].connectedTo) {
        return bloq.connectors;
    } else {
        var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
        return _.uniq(bloq.connectors.concat(getBranchsConnectors(bloqBranchUuid)));
    }
};

var drag = function(evt) {

    if (evt.originalEvent.clientX && evt.originalEvent.clientY) {
        var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];
        var target = evt.currentTarget,
            x = evt.originalEvent.clientX,
            y = evt.originalEvent.clientY;

        var originX = target.style.left,
            originY = target.style.top;


        var destinationX = (x - target.getAttribute('data-drag-mouseX')),
            destinationY = (y - target.getAttribute('data-drag-mouseY'));

        target.style.left = destinationX + 'px';
        target.style.top = destinationY + 'px';


        var deltaX = destinationX - parseInt(originX, 10),
            deltaY = destinationY - parseInt(originY, 10);
        //console.log('deltaX', deltaX, 'deltaY', deltaY);

        //console.log('start move conected bloqs', connectors[bloq.connectors[1]].connectedTo);
        //console.log(bloq.bloqData.type);
        switch (bloq.bloqData.type) {
            case 'statement':
                moveTreeNodes(connectors[bloq.connectors[1]].connectedTo, deltaX, deltaY);
                handleCollisions([bloq.connectors[0], getLastBottomConnectorUuid(bloq.uuid)], evt);
                break;
            case 'output':
                //console.log('output bloq drag');
                handleIOCollisions(bloq, availableIOConnectors);
                break;
            default:
                throw 'Not defined bloq drag!!';
        }
    }
};

var moveTreeNodes = function(connectorUuid, deltaX, deltaY, goUp) {
    if (connectorUuid) {
        var bloq = bloqs[connectors[connectorUuid].bloqUuid];
        bloq.$bloq.offset({
            top: bloq.$bloq.offset().top + deltaY,
            left: bloq.$bloq.offset().left + deltaX
        });
        if (goUp) {
            moveTreeNodes(connectors[bloq.connectors[0]].connectedTo, deltaX, deltaY, goUp);
        } else {
            moveTreeNodes(connectors[bloq.connectors[1]].connectedTo, deltaX, deltaY, goUp);
        }
    }
};

var dragend = function(evt) {

    $('.bloq').removeClass('dragging');
    var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];
    switch (bloq.bloqData.type) {
        case 'statement':
            statementDragEnd();
            break;
        case 'output':
            outputDragEnd(bloq);
            break;
        default:
            throw 'Not defined bloq drag!!';
    }
};

var statementDragEnd = function() {
    var $dropConnector = $('.connector.available');
    if ($dropConnector[0]) {
        var dropConnectorUuid = $dropConnector.attr('data-connector-id');
        var dragConnectorUuid = $('[data-connector-id="' + dropConnectorUuid + '"]').attr('data-canconnectwith');

        //console.log('dragConnectorUuid', dragConnectorUuid);
        //console.log('dropUuid', dropConnectorUuid);
        placeNestedBloq(dropConnectorUuid, dragConnectorUuid);
        setConnections(dropConnectorUuid, dragConnectorUuid);
    }
    $('.connector.available').removeClass('available');

    availableConnectors = [];
    drawTree(bloqs, connectors);
};

var outputDragEnd = function(bloq) {
    var $dropConnector = $('.connector.available');
    if ($dropConnector[0]) {
        var dropConnectorUuid = $dropConnector.attr('data-connector-id');
        var dragConnectorUuid = getOutputConnector(bloq, IOConnectors).uuid;

        $dropConnector.append(bloq.$bloq);
        bloq.$bloq.addClass('nested-bloq').removeAttr('style');

        IOConnectors[dropConnectorUuid].connectedTo = dragConnectorUuid;
        IOConnectors[dragConnectorUuid].connectedTo = dropConnectorUuid;

    }

    $dropConnector.removeClass('available');
};

var handleCollisions = function(dragConnectors) {
    var i,
        found,
        $dropConnector,
        $dragConnector;

    // For each available connector
    availableConnectors.forEach(function(dropConnectorUuid) {
        $dropConnector = $('[data-connector-id="' + dropConnectorUuid + '"]');
        i = 0;
        found = false;
        while (!found && (i < dragConnectors.length)) {
            $dragConnector = $('[data-connector-id="' + dragConnectors[i] + '"]');

            if ((connectors[dragConnectors[i]].data.type === connectors[dropConnectorUuid].data.accept) && utils.itsOver($dragConnector, $dropConnector, 20)) {
                found = true;
            } else {
                i++;
            }
        }
        if (found) {
            $dropConnector.addClass('available');
            $dropConnector.attr('data-canconnectwith', dragConnectors[i]);
        } else {
            $dropConnector.removeClass('available');
            $dropConnector.removeAttr('data-canconnectwith');
        }
    });
};

var getOutputConnector = function(bloq, IOConnectors) {
    var i = 0,
        outputConnector = null;

    while (!outputConnector && (i < bloq.IOConnectors.length)) {
        if (IOConnectors[bloq.IOConnectors[i]].data.type === 'connector--output') {
            outputConnector = IOConnectors[bloq.IOConnectors[i]];
        }
        i++;
    }

    if (!outputConnector) {
        throw 'outputBloq has no connector-output';
    } else {
        return outputConnector;
    }
};

var handleIOCollisions = function(bloq, availableIOConnectors) {
    var dropConnector;

    var dragConnector = getOutputConnector(bloq, IOConnectors);


    availableIOConnectors.forEach(function(dropConnectorUuid) {
        dropConnector = IOConnectors[dropConnectorUuid];

        if (dragConnector.data.type === dropConnector.data.accept && utils.itsOver(dragConnector.jqueryObject, dropConnector.jqueryObject, 20)) {

            dropConnector.jqueryObject.addClass('available');

        } else {
            dropConnector.jqueryObject.removeClass('available');

        }
    });
};

var setConnections = function(dropConnectorUuid, dragConnectorUUid) {
    //console.log('conectamos', dropConnectorUuid, connectors[dropConnectorUuid].data.type, 'con ', dragConnectorUUid, connectors[dragConnectorUUid].data.type);
    //console.log('conectado con', connectors[dropConnectorUuid].connectedTo, 'y el otro con', connectors[dragConnectorUUid].connectedTo);
    if (connectors[dropConnectorUuid].connectedTo) {
        if (connectors[dropConnectorUuid].data.type === 'connector--bottom') {
            var dropBottomConnectorUuid = connectors[dropConnectorUuid].connectedTo,
                dragBloqLastBottomConnectorUuid = getLastBottomConnectorUuid(connectors[dragConnectorUUid].bloqUuid);
            connectors[dragBloqLastBottomConnectorUuid].connectedTo = dropBottomConnectorUuid;
            connectors[dropBottomConnectorUuid].connectedTo = dragBloqLastBottomConnectorUuid;
        } else if (connectors[dropConnectorUuid].data.type === 'connector--top') {
            var dropTopConnectorUuid = connectors[dropConnectorUuid].connectedTo,
                dragBloqFirstTopConnectorUuid = getFirstTopConnectorUuid(connectors[dragConnectorUUid].bloqUuid);
            connectors[dropTopConnectorUuid].connectedTo = dragBloqFirstTopConnectorUuid;
            connectors[dragBloqFirstTopConnectorUuid].connectedTo = dropTopConnectorUuid;
        }
    }
    connectors[dropConnectorUuid].connectedTo = dragConnectorUUid;
    connectors[dragConnectorUUid].connectedTo = dropConnectorUuid;
};

var placeNestedBloq = function(dropConnectorUuid, dragConnectorUUid) {
    console.log('Nest');

    var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid],
        dragBloq = bloqs[connectors[dragConnectorUUid].bloqUuid];
    console.log(dropBloq, dragBloq);

    switch (dropBloq.bloqData.type) {
        case 'statement':
            var originX = dragBloq.$bloq.offset().left,
                originY = dragBloq.$bloq.offset().top,
                finalTop,
                finalLeft = dropBloq.$bloq.offset().left,
                goUp = false,
                dropBloqsMoveOrientation = 1,
                connectorsStart = connectors[dragBloq.connectors[1]].connectedTo;
            if (connectors[dropConnectorUuid].data.type === 'connector--top') {

                finalTop = dropBloq.$bloq.offset().top - dragBloq.$bloq.outerHeight(true);
                connectorsStart = connectors[dragBloq.connectors[0]].connectedTo;
                goUp = true;
                dropBloqsMoveOrientation = -1;
            } else {
                finalTop = dropBloq.$bloq.offset().top + dragBloq.$bloq.outerHeight(true);
            }
            if (connectors[dropConnectorUuid].connectedTo) {
                moveTreeNodes(connectors[dropConnectorUuid].connectedTo, 0, getTreeHeight(dragBloq.uuid) * (dropBloqsMoveOrientation), goUp);
            }
            dragBloq.$bloq.offset({
                top: finalTop,
                left: finalLeft
            });
            moveTreeNodes(connectorsStart, finalLeft - originX, finalTop - originY, goUp);
            break;
        case 'output':
            break;
        default:
            throw 'bloqtype not defined in nesting' + dropBloq.bloqData.type;
    }
};

var getTreeHeight = function(bloqUuid) {
    var bloq = bloqs[bloqUuid];
    var topConnectorUuid = connectors[bloq.connectors[0]].connectedTo,
        bottomConnectorUuid = connectors[bloq.connectors[1]].connectedTo;

    var height = bloq.$bloq.outerHeight(true);

    if (topConnectorUuid) {
        height += getNodesHeight(connectors[topConnectorUuid].bloqUuid, false);
    }

    if (bottomConnectorUuid) {
        height += getNodesHeight(connectors[bottomConnectorUuid].bloqUuid, true);
    }
    return height;
};

var getNodesHeight = function(bloqUuid, bloqIsTop) {
    var bloq = bloqs[bloqUuid];
    var connectorPosition;
    if (bloqIsTop) {
        connectorPosition = 1;
    } else {
        connectorPosition = 0;
    }
    if (connectors[bloq.connectors[connectorPosition]].connectedTo) {
        return bloq.$bloq.outerHeight(true) + getNodesHeight(connectors[connectors[bloq.connectors[connectorPosition]].connectedTo].bloqUuid, bloqIsTop);
    } else {
        return bloq.$bloq.outerHeight(true);
    }
};

var drawTree = function(bloqs, connectors) {
    console.log('drawtree');
    //buscamos los tipo statement q no tienen un top conectado
    for (var uuid in bloqs) {

        if (bloqs[uuid].bloqData.type === 'statement') {
            if (!connectors[bloqs[uuid].connectors[0]].connectedTo) {
                console.log('******* - tree - *********', uuid);
                console.log('connector--top:', bloqs[uuid].connectors[0], 'connectedTo', connectors[bloqs[uuid].connectors[0]].connectedTo);
                console.log('connector--bottom:', bloqs[uuid].connectors[1], 'connectedTo', connectors[bloqs[uuid].connectors[1]].connectedTo);
                if (connectors[bloqs[uuid].connectors[1]].connectedTo) {
                    drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[1]].connectedTo);
                }

            }
        }

    }
};

var drawBranch = function(bloqs, connectors, topConnectorUuid) {
    var branchUuid = connectors[topConnectorUuid].bloqUuid;
    console.log('          ******* - branch - *********', branchUuid);
    console.log('          connector--top:', bloqs[branchUuid].connectors[0], 'connectedTo', connectors[bloqs[branchUuid].connectors[0]].connectedTo);
    console.log('          connector--bottom:', bloqs[branchUuid].connectors[1], 'connectedTo', connectors[bloqs[branchUuid].connectors[1]].connectedTo);
    if (connectors[bloqs[branchUuid].connectors[1]].connectedTo) {
        drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[1]].connectedTo);
    }
};


// Block Constructor
var Bloq = function Bloq(params) {
    console.log(params.bloqData);
    this.uuid = utils.generateUUID();

    this.bloqData = params.bloqData;
    this.connectors = [];
    this.IOConnectors = [];

    //creation

    this.$bloq = $('<div>').attr({
        'data-bloq-id': this.uuid,
        draggable: true,
        tabIndex: 0
    });

    this.$bloq.addClass('bloq bloq--' + this.bloqData.type);


    //content
    var $tempElement;
    for (var j = 0; j < this.bloqData.content.length; j++) {
        for (var k = 0; k < this.bloqData.content[j].length; k++) {
            $tempElement = utils.createBloqElement(this.bloqData.content[j][k]);
            this.$bloq.append($tempElement);
        }
    }

    //connectors
    var $connector, tempUuid, tempConnector;
    for (var i = 0; i < params.bloqData.connectors.length; i++) {

        tempUuid = utils.generateUUID();

        tempConnector = {
            uuid: tempUuid,
            data: params.bloqData.connectors[i],
            bloqUuid: this.uuid,
            connectedTo: null
        };

        switch (params.bloqData.connectors[i].type) {
            case 'connector--top':
            case 'connector--bottom':
                $connector = $('<div>').attr({
                    'data-connector-id': tempUuid
                });
                $connector.addClass('connector connector--offline ' + params.bloqData.connectors[i].type);

                this.$bloq.append($connector);

                connectors[tempUuid] = tempConnector;

                this.connectors.push(tempUuid);
                break;
            case 'connector--input':
                $connector = $(this.$bloq.children('.bloqinput')[this.IOConnectors.length]);

                $connector.attr({
                    'data-connector-id': tempUuid
                }).addClass('connector ' + params.bloqData.connectors[i].type);


                IOConnectors[tempUuid] = tempConnector;

                this.IOConnectors.push(tempUuid);
                break;
            case 'connector--output':
                $connector = $('<div>').attr({
                    'data-connector-id': tempUuid
                }).addClass('connector connector--offline ' + params.bloqData.connectors[i].type);

                this.$bloq.append($connector);

                IOConnectors[tempUuid] = tempConnector;

                this.IOConnectors.push(tempUuid);
                break;


            default:
                throw 'Connector not defined to build';
        }
        tempConnector.jqueryObject = $connector;
    }

    this.$bloq.children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
    this.$bloq.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');


    //binds
    this.$bloq.bind('dragstart', dragstart);
    this.$bloq.bind('drag', drag);
    this.$bloq.bind('dragend', dragend);

    bloqs[this.uuid] = this;

    return this.$bloq;
};

module.exports = Bloq;