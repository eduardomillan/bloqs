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
    availableIOConnectors = [],
    $field = null,
    scrollTop = 0;


var dragstart = function(evt) {

    //obtenemos el bloque
    var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];

    evt.stopPropagation();


    //transparent
    evt.originalEvent.dataTransfer.setDragImage(document.getElementById('empty'), 0, 0);

    //establecemos el punto del raton dentor del area y se lo marcamos para que al arrastrar lo tenga en cuenta
    var mousePosition = utils.getMousePosition(evt.currentTarget);


    //Este es para tener en cuenta el scrollbar del toolbox
    //evt.currentTarget.parentNode.parentNode.scrollTop;

    //Este es para tener en cuenta el scrollbar del field

    if (evt.currentTarget.parentNode === $field[0]) {
        //console.log('estaba en field');
        evt.currentTarget.setAttribute('data-drag-mouseX', (evt.originalEvent.pageX - mousePosition.x));
        evt.currentTarget.setAttribute('data-drag-mouseY', (evt.originalEvent.pageY - mousePosition.y));
    } else if (utils.hasClass(evt.currentTarget.parentNode, 'bloq--extension__content')) {
        //console.log('estaba en un bloq');
        evt.currentTarget.setAttribute('data-drag-mouseX', (evt.originalEvent.pageX - mousePosition.x));
        evt.currentTarget.setAttribute('data-drag-mouseY', (evt.originalEvent.pageY - mousePosition.y));
    } else {
        //console.log('estaba en toolbox');
        evt.currentTarget.setAttribute('data-drag-mouseX', (evt.originalEvent.pageX - mousePosition.x + evt.currentTarget.parentNode.parentNode.scrollLeft - $field[0].scrollLeft));
        evt.currentTarget.setAttribute('data-drag-mouseY', (evt.originalEvent.pageY - mousePosition.y + evt.currentTarget.parentNode.parentNode.scrollTop - $field[0].scrollTop));
    }


    scrollTop = $field[0].scrollTop;


    //console.log('dar-mouse-y', (evt.originalEvent.pageY - mousePosition.y));

    //según el tipo de bloque que arrastramos se desconecta de una forma u otra
    switch (bloq.bloqData.type) {
        case 'statement':
        case 'statement-input':
            bloq.droppable = true;
            statementDragStart(bloq);
            break;
        case 'output':
            bloq.droppable = true;
            outputDragStart(bloq);
            break;
        case 'group':
            throw 'Group cant be moved';
        default:
            throw 'Not defined bloq dragstart!!';
    }
};

var statementDragStart = function(bloq) {

    var previousConnector = connectors[bloq.connectors[0]].connectedTo;

    if (previousConnector) {
        var previousBloq = bloqs[connectors[previousConnector].bloqUuid];

        var itsInsideAConnectorRoot = utils.itsInsideAConnectorRoot(bloq, bloqs, connectors);
        //console.log('its Inside a connector-root', itsInsideAConnectorRoot);
        //desenganchamos
        connectors[previousConnector].connectedTo = null;
        connectors[bloq.connectors[0]].connectedTo = null;

        //miramos si estaba enganchado a un connector-root para sacarlo del parent

        if (itsInsideAConnectorRoot) {
            var oldBloqContainer = previousBloq.$bloq.find('.bloq--extension__content');
            setTimeout(function() {

                removeFromStatementInput(bloq);

                //another bug on chrome, we need to remove and add again the width, to force the browser to redraw
                oldBloqContainer.css('width', '50px');
                setTimeout(function() {
                    oldBloqContainer.css('width', 'auto');
                    utils.redrawTree(previousBloq, bloqs, connectors);
                }, 100);
            }, 0);

        }
    }

    availableConnectors = [];
    for (var connectorUuid in connectors) {
        if (connectors[connectorUuid].data.type !== 'connector--empty') {
            if (utils.connectorIsDroppable(connectorUuid, bloqs, connectors)) {
                if (!utils.connectorIsInBranch(connectorUuid, bloq.uuid, bloqs, connectors)) {
                    availableConnectors.push(connectorUuid);
                } else {
                    utils.getBloqByConnectorUuid(connectorUuid, bloqs, connectors).$bloq.addClass('dragging');
                }
            }
        }
    }
    //console.log(availableConnectors);
};

var removeFromStatementInput = function(firstBloqToRemove) {
    var totalBloqsToRemove = [firstBloqToRemove];
    var childConnectorUuid = connectors[firstBloqToRemove.connectors[1]].connectedTo,
        bloqToRemove,
        top = firstBloqToRemove.$bloq.outerHeight(true);

    firstBloqToRemove.$bloq.removeClass('inside-bloq');
    //console.log('redrawChilds on drag');
    while (childConnectorUuid) {
        bloqToRemove = bloqs[connectors[childConnectorUuid].bloqUuid];
        totalBloqsToRemove.push(bloqToRemove);
        bloqToRemove.$bloq.removeClass('inside-bloq');
        bloqToRemove.$bloq.css({
            top: top
        });
        top += bloqToRemove.$bloq.outerHeight(true);
        childConnectorUuid = connectors[bloqToRemove.connectors[1]].connectedTo;
    }
    var rawArray = $.map(
        totalBloqsToRemove,
        function(value) {

            // Return the unwrapped version. This will return
            // the underlying DOM nodes contained within each
            // jQuery value.
            return (value.$bloq.get());

        }
    );

    // Add the raw DOM array to the current collection.
    $field.append(rawArray);

};


var outputDragStart = function(bloq) {
    var outputConnector = utils.getOutputConnector(bloq, IOConnectors);
    if (outputConnector.connectedTo) {
        bloq.$bloq.removeClass('nested-bloq');

        var bloqConnector = IOConnectors[outputConnector.connectedTo];

        //remove the logical conexions
        bloqConnector.connectedTo = null;
        outputConnector.connectedTo = null;

        //Chrome bug http://stackoverflow.com/questions/14203734/dragend-dragenter-and-dragleave-firing-off-immediately-when-i-drag
        //Dragend its fired on changing dom of dragable element, timeout fix this
        setTimeout(function() {
            console.log('append');
            $field.append(bloq.$bloq);

            bloqConnector.jqueryObject.css('width', '50px');
            //another bug on chrome, we need to remove and add again the width, to force the browser to redraw
            setTimeout(function() {
                bloqConnector.jqueryObject.css('width', 'auto');
            }, 100);
        }, 0);

    }
    bloq.$bloq.addClass('dragging');

    //store the available connectors
    var totalConectorsUuids = utils.getConnectorsUuidByType(IOConnectors, 'connector--input', outputConnector.returnType);
    var freeInputs = utils.getNotConnected(IOConnectors, totalConectorsUuids);
    var childInputsConnectorsUuids = utils.getInputsConnectorsFromBloq(IOConnectors, bloqs, bloq);

    availableIOConnectors = _.difference(freeInputs, childInputsConnectorsUuids);
};

var drag = function(evt) {
    //console.log('draging');
    if (evt.originalEvent.clientX && evt.originalEvent.clientY) {

        var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];


        if (scrollTop !== $field[0].scrollTop) {
            //console.log('scrollChange', scrollTop, $field[0].scrollTop, '=', scrollTop - $field[0].scrollTop);
            evt.currentTarget.setAttribute('data-drag-mouseY', parseFloat(evt.currentTarget.getAttribute('data-drag-mouseY')) + scrollTop - $field[0].scrollTop);
            scrollTop = $field[0].scrollTop;
        }


        var target = evt.currentTarget,
            x = evt.originalEvent.clientX - $field[0].offsetParent.offsetLeft,
            y = evt.originalEvent.clientY - $field[0].offsetParent.offsetTop;

        var destinationX = (x - target.getAttribute('data-drag-mouseX')),
            destinationY = (y - target.getAttribute('data-drag-mouseY'));

        target.style.left = destinationX + 'px';
        target.style.top = destinationY + 'px';

        switch (bloq.bloqData.type) {
            case 'statement':
            case 'statement-input':
                utils.redrawTree(bloq, bloqs, connectors);
                handleCollisions([bloq.connectors[0], utils.getLastBottomConnectorUuid(bloq.uuid, bloqs, connectors)], evt);
                break;
            case 'output':
                handleIOCollisions(bloq, availableIOConnectors);
                break;
            default:
                throw 'Not defined bloq drag!!';
        }
    }
};



var dragend = function(evt) {
    //console.log('dragend');
    $('.bloq').removeClass('dragging');
    scrollTop = 0;

    var $dropConnector = $('.connector.available');
    if ($dropConnector[0]) {

        var bloq = bloqs[$(evt.currentTarget).attr('data-bloq-id')];
        switch (bloq.bloqData.type) {
            case 'statement':
            case 'statement-input':
                statementDragEnd(bloq, $dropConnector);
                break;
            case 'output':
                outputDragEnd(bloq, $dropConnector);
                break;
            default:
                throw 'Not defined bloq drag!!';
        }
    }
    availableConnectors = [];
    availableIOConnectors = [];
    $('.connector.available').removeClass('available');
    utils.drawTree(bloqs, connectors);
};

var statementDragEnd = function(bloq, $dropConnector) {

    var dropConnectorUuid = $dropConnector.attr('data-connector-id');
    var dragConnectorUuid = $('[data-connector-id="' + dropConnectorUuid + '"]').attr('data-canconnectwith');

    //console.log('dragConnectorUuid', dragConnectorUuid);
    //console.log('dropUuid', dropConnectorUuid);
    var areDroppingInsideABloq = utils.itsARootConnector(connectors[dropConnectorUuid]) || utils.itsInsideAConnectorRoot(utils.getBloqByConnectorUuid(dropConnectorUuid, bloqs, connectors), bloqs, connectors);

    //console.log('areDroppingInsideABloq?', areDroppingInsideABloq);

    setLogicalConnections(dropConnectorUuid, dragConnectorUuid);
    if (areDroppingInsideABloq) {
        connectorRootDragEnd(bloq, $dropConnector);
    } else {
        placeNestedBloq(dropConnectorUuid, dragConnectorUuid);
    }


};

var connectorRootDragEnd = function(dragBloq, $dropConnector) {
    //console.log('connectorRootDragEnd');
    var dropConnectorUuid = $dropConnector.attr('data-connector-id');
    var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid];


    dragBloq.$bloq.addClass('inside-bloq');
    dragBloq.$bloq.removeAttr('style');


    if (utils.itsARootConnector(connectors[dropConnectorUuid])) {
        var $dropContainer = dropBloq.$bloq.find('.bloq--extension__content');
        $dropContainer.append(dragBloq.$bloq);

    } else {
        dropBloq.$bloq.after(dragBloq.$bloq);
    }

    //var childNodes

    var somethingConnectedInBottomUuid = connectors[dragBloq.connectors[1]].connectedTo;
    var branchBloq;
    var childNodes = [];
    while (somethingConnectedInBottomUuid) {
        branchBloq = bloqs[connectors[somethingConnectedInBottomUuid].bloqUuid];
        childNodes.push(branchBloq.$bloq);
        branchBloq.$bloq.addClass('inside-bloq');
        branchBloq.$bloq.removeAttr('style');

        somethingConnectedInBottomUuid = connectors[branchBloq.connectors[1]].connectedTo;

    }
    dragBloq.$bloq.after(utils.jqueryObjectsArrayToHtmlToInsert(childNodes));

    //se repinta el arbol donde esta el dropbloq, porq cambiara de tamaño
    utils.redrawTree(dropBloq, bloqs, connectors);
};

var outputDragEnd = function(bloq, $dropConnector) {

    var dropConnectorUuid = $dropConnector.attr('data-connector-id');
    var dragConnectorUuid = utils.getOutputConnector(bloq, IOConnectors).uuid;

    $dropConnector.append(bloq.$bloq);
    bloq.$bloq.addClass('nested-bloq').removeAttr('style');

    IOConnectors[dropConnectorUuid].connectedTo = dragConnectorUuid;
    IOConnectors[dragConnectorUuid].connectedTo = dropConnectorUuid;

};

var handleCollisions = function(dragConnectors) {
    var i,
        found,
        $dropConnector,
        $dragConnector;

    // For each available connector
    availableConnectors.forEach(function(dropConnectorUuid) {
        $dropConnector = connectors[dropConnectorUuid].jqueryObject;
        i = 0;
        found = false;
        while (!found && (i < dragConnectors.length)) {
            $dragConnector = connectors[dragConnectors[i]].jqueryObject;

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


var handleIOCollisions = function(bloq, availableIOConnectors) {
    var dropConnector;

    var dragConnector = utils.getOutputConnector(bloq, IOConnectors);


    availableIOConnectors.forEach(function(dropConnectorUuid) {
        dropConnector = IOConnectors[dropConnectorUuid];

        if (dragConnector.data.type === dropConnector.data.accept && utils.itsOver(dragConnector.jqueryObject, dropConnector.jqueryObject, 20)) {

            dropConnector.jqueryObject.addClass('available');

        } else {
            dropConnector.jqueryObject.removeClass('available');

        }
    });
};

var setLogicalConnections = function(dropConnectorUuid, dragConnectorUUid) {
    //console.log('conectamos', dropConnectorUuid, connectors[dropConnectorUuid].data.type, 'con ', dragConnectorUUid, connectors[dragConnectorUUid].data.type);
    //console.log('conectado con', connectors[dropConnectorUuid].connectedTo, 'y el otro con', connectors[dragConnectorUUid].connectedTo);
    if (connectors[dropConnectorUuid].connectedTo) {
        var dropBottomConnectorUuid, dragBloqLastBottomConnectorUuid, dropTopConnectorUuid, dragBloqFirstTopConnectorUuid;
        switch (connectors[dropConnectorUuid].data.type) {
            case 'connector--bottom':
                dropBottomConnectorUuid = connectors[dropConnectorUuid].connectedTo;
                dragBloqLastBottomConnectorUuid = utils.getLastBottomConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
                connectors[dragBloqLastBottomConnectorUuid].connectedTo = dropBottomConnectorUuid;
                connectors[dropBottomConnectorUuid].connectedTo = dragBloqLastBottomConnectorUuid;
                break;
            case 'connector--top':
                dropTopConnectorUuid = connectors[dropConnectorUuid].connectedTo;
                dragBloqFirstTopConnectorUuid = utils.getFirstTopConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
                connectors[dropTopConnectorUuid].connectedTo = dragBloqFirstTopConnectorUuid;
                connectors[dragBloqFirstTopConnectorUuid].connectedTo = dropTopConnectorUuid;
                break;
            case 'connector--root':
                dropBottomConnectorUuid = connectors[dropConnectorUuid].connectedTo;
                dragBloqLastBottomConnectorUuid = utils.getLastBottomConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
                connectors[dragBloqLastBottomConnectorUuid].connectedTo = dropBottomConnectorUuid;
                connectors[dropBottomConnectorUuid].connectedTo = dragBloqLastBottomConnectorUuid;
                break;
            default:
                throw 'connector on setLogicalConnections no handled ' + connectors[dropConnectorUuid].data.type;
        }
    }
    connectors[dropConnectorUuid].connectedTo = dragConnectorUUid;
    connectors[dragConnectorUUid].connectedTo = dropConnectorUuid;
};

var placeNestedBloq = function(dropConnectorUuid, dragConnectorUuid) {
    console.log('Nest');

    var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid];
    //console.log(dropBloq, dragBloq);

    switch (dropBloq.bloqData.type) {
        case 'statement':
        case 'statement-input':
            utils.redrawTree(utils.getBloqByConnectorUuid(dragConnectorUuid, bloqs, connectors), bloqs, connectors);
            break;
        case 'output':
            break;
        default:
            throw 'bloqtype not defined in nesting ' + dropBloq.bloqData.type;
    }
};

var removeBloq = function(bloqUuid, redraw) {

    var bloq = bloqs[bloqUuid];
    if (bloq) {
        //disconnect
        var topConnector, bottomConnector;
        switch (bloq.bloqData.type) {
            case 'statement-input':
                var tempBloq,
                    childConnector = connectors[bloq.connectors[2]].connectedTo;

                while (childConnector) {
                    tempBloq = utils.getBloqByConnectorUuid(childConnector, bloqs, connectors);
                    childConnector = connectors[tempBloq.connectors[1]].connectedTo;
                    removeBloq(tempBloq.uuid);
                }
                /* falls through */
            case 'statement':

                topConnector = connectors[bloq.connectors[0]].connectedTo;
                bottomConnector = connectors[bloq.connectors[1]].connectedTo;


                if (topConnector && bottomConnector) {
                    connectors[topConnector].connectedTo = bottomConnector;
                    connectors[bottomConnector].connectedTo = topConnector;

                    if (redraw) {
                        utils.redrawTree(utils.getBloqByConnectorUuid(topConnector, bloqs, connectors), bloqs, connectors);
                    }

                } else if (topConnector) {
                    connectors[topConnector].connectedTo = null;

                    if (redraw) {
                        utils.redrawTree(utils.getBloqByConnectorUuid(topConnector, bloqs, connectors), bloqs, connectors);
                    }
                } else if (bottomConnector) {
                    connectors[bottomConnector].connectedTo = null;
                }
                break;
            default:
                throw 'we dont know how to delete: ' + bloq.bloqdata.type;
        }

        //remove visual
        bloq.$bloq.remove();
        //removeLogical
        var i;
        for (i = 0; i < bloq.connectors.length; i++) {
            delete connectors[bloq.connectors[i]];
        }
        for (i = 0; i < bloq.IOConnectors.length; i++) {
            delete IOConnectors[bloq.IOConnectors[i]];
        }
        delete bloqs[bloqUuid];


    } else {
        throw 'Cant delete this bloq: ' + bloqUuid;
    }

};

var buildContent = function(componentsArray, bloqData, $contentContainer) {
    console.log(bloqData.name);
    var $tempElement;
    for (var j = 0; j < bloqData.content.length; j++) {
        for (var k = 0; k < bloqData.content[j].length; k++) {
            $tempElement = utils.createBloqElement(bloqData.content[j][k], componentsArray);
            $contentContainer.append($tempElement);
        }
    }
};

var addBloqsListener = function($bloq) {
    $bloq.bind('dragstart', dragstart);
    $bloq.bind('drag', drag);
    $bloq.bind('dragend', dragend);
};

var buildConnectors = function(bloqConnectors, bloq) {
    //connectors
    var $connector, tempUuid, tempConnector;
    for (var i = 0; i < bloqConnectors.length; i++) {

        tempUuid = 'connector:' + utils.generateUUID();

        tempConnector = {
            uuid: tempUuid,
            data: bloqConnectors[i],
            bloqUuid: bloq.uuid,
            connectedTo: null
        };

        switch (bloqConnectors[i].type) {
            case 'connector--top':
            case 'connector--bottom':
            case 'connector--root':
                $connector = $('<div>').attr({
                    'data-connector-id': tempUuid
                });

                $connector.addClass('connector connector--offline ' + bloqConnectors[i].type);

                bloq.$bloq.append($connector);

                connectors[tempUuid] = tempConnector;

                bloq.connectors.push(tempUuid);
                break;
            case 'connector--input':
                $connector = $(bloq.$bloq.find('.bloqinput[data-connector-name="' + bloqConnectors[i].name + '"]'));

                $connector.attr({
                    'data-connector-id': tempUuid
                }).addClass('connector ' + bloqConnectors[i].type);


                IOConnectors[tempUuid] = tempConnector;

                bloq.IOConnectors.push(tempUuid);
                break;
            case 'connector--output':
                $connector = $('<div>').attr({
                    'data-connector-id': tempUuid
                }).addClass('connector connector--offline ' + bloqConnectors[i].type);

                bloq.$bloq.append($connector);

                tempConnector.returnType = bloq.bloqData.returnType;
                IOConnectors[tempUuid] = tempConnector;

                bloq.IOConnectors.push(tempUuid);
                break;
            case 'connector--empty':
                $connector = $('<div>');
                connectors[tempUuid] = tempConnector;

                bloq.connectors.push(tempUuid);
                break;
            default:
                throw 'Connector not defined to build';
        }
        tempConnector.jqueryObject = $connector;
    }
};


// Block Constructor
var Bloq = function Bloq(params) {
    //console.log(params.bloqData);

    this.uuid = 'bloq:' + utils.generateUUID();
    $field = $field || params.$field;

    this.bloqData = params.bloqData;
    this.componentsArray = params.componentsArray;
    this.connectors = [];
    this.IOConnectors = [];


    //creation
    this.$bloq = $('<div>').attr({
        'data-bloq-id': this.uuid,
        tabIndex: 0
    });

    this.$bloq.addClass('bloq bloq--' + this.bloqData.type);

    switch (this.bloqData.type) {
        case 'statement-input':
            this.droppable = false;
            this.$bloq.append('<div class="bloq--statement-input__header"></div><div class="bloq--extension"><div class="bloq--extension__content"></div> <div class="bloq--extension--end"></div></div>');
            this.$contentContainer = this.$bloq.find('.bloq--statement-input__header');
            this.$bloq.attr('draggable', true);
            buildContent(this.componentsArray, this.bloqData, this.$contentContainer);
            addBloqsListener(this.$bloq);
            buildConnectors(params.bloqData.connectors, this);
            break;
        case 'statement':
            this.droppable = false;
            this.$contentContainer = this.$bloq;
            this.$bloq.attr('draggable', true);
            buildContent(this.componentsArray, this.bloqData, this.$contentContainer);
            addBloqsListener(this.$bloq);
            buildConnectors(params.bloqData.connectors, this);
            this.$bloq.children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
            this.$bloq.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
            break;
        case 'output':
            this.droppable = false;
            this.$contentContainer = this.$bloq;
            this.$bloq.attr('draggable', true);
            buildContent(this.componentsArray, this.bloqData, this.$contentContainer);
            addBloqsListener(this.$bloq);
            buildConnectors(params.bloqData.connectors, this);
            break;
        case 'group':
            this.droppable = true;
            this.$bloq.append('<div class="field--header"><button class="btn btn--collapsefield"></button><h3>' + this.bloqData.headerText + '</h3></div><p>' + this.bloqData.descriptionText + '</p><div class="bloq--extension--info">Arrastra un bloque aquí para empezar tu programa</div><div class="bloq--extension__content"></div>');
            buildConnectors(params.bloqData.connectors, this);
            break;
        default:
            throw 'bloqData ' + this.bloqData.type + 'not defined in bloq construction';
    }


    /**
     * Get the bloq's code, substituting each input's value
     * @return {[type]} code            [description]
     */
    this.getCode = function() {
        var code = this.bloqData.code;
        var childBloq, childConnectorId;
        var elementTags = _.without(_.pluck(this.bloqData.content[0], 'id'), undefined);
        var childrenTags = _.without(_.pluck(this.bloqData.content[0], 'bloqInputId'), undefined);
        console.log('bloqData', this.bloqData);
        // utils.validString('a');
        var value = '',
            type = '',
            i, j;
        for (i in elementTags) {
            value = this.$bloq.find('[data-content-id="' + elementTags[i] + '"]').val() || '';
            if (this.$bloq.find('[data-content-type = "stringInput"]')) {
                value = utils.validString(value);
            }
            code = code.replace(new RegExp('{' + elementTags[i] + '}', 'g'), value);
        }

        //search for regular expressions:
        var reg = /(.*)\?(.*):(.*)/g;
        if (reg.test(code)) {
            code = eval(code); // jshint ignore:line
        }

        var bloqInputConnectors = utils.getInputsConnectorsFromBloq(IOConnectors, bloqs, this);
        if (childrenTags.length > 0) {
            // search for child bloqs:
            for (j in bloqInputConnectors) {
                value = '';
                var a = IOConnectors[bloqInputConnectors[j]];
                childConnectorId = a.connectedTo;
                if (childConnectorId !== null) {
                    childBloq = utils.getBloqByConnectorUuid(childConnectorId, bloqs, IOConnectors);
                    value = childBloq.getCode();
                    type = childBloq.bloqData.returnType;
                }
                code = code.replace(new RegExp('{' + childrenTags[j] + '.connectionType}', 'g'), type);
                code = code.replace(new RegExp('{' + childrenTags[j] + '}', 'g'), value);
            }
        }
        var children = [];
        if (this.connectors[2]) {
            value = '';
            childConnectorId = connectors[this.connectors[2]].connectedTo;
            if (childConnectorId) {
                childBloq = utils.getBloqByConnectorUuid(childConnectorId, bloqs, connectors);
                var branchConnectors = utils.getBranchsConnectorsNoChildren(childBloq.uuid, connectors, bloqs);
                for (i in branchConnectors) {
                    if (utils.itsInsideAConnectorRoot(bloqs[connectors[branchConnectors[i]].bloqUuid], bloqs, connectors)) {
                        var bloqId = connectors[branchConnectors[i]].bloqUuid;
                        if (bloqId !== children[children.length - 1]) {
                            children.push(bloqId);
                        }
                    }
                }
            }
            for (i in children) {
                value += bloqs[children[i]].getCode();
            }
            code = code.replace(new RegExp('{STATEMENTS}', 'g'), value);
        }
        return code;
    };


    bloqs[this.uuid] = this;
    return this;
};

module.exports.Bloq = Bloq;
module.exports.connectors = connectors;
module.exports.bloqs = bloqs;
module.exports.removeBloq = removeBloq;