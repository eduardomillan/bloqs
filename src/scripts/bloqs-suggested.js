'use strict';
(function(bloqsSuggested, bloqsLanguages, bloqsUtils) {

    var suggestedWindow,
        header,
        headerTitle,
        bloqsContainer,
        bloqSchemas,
        windowParent,
        suggestedBloqs,
        showWindowCallback;

    function init(suggestionWindowParent, schemas) {
        windowParent = suggestionWindowParent || windowParent;
        bloqSchemas = schemas || bloqSchemas;
    }

    function showSuggestedWindow(params) {
        if (bloqSchemas) {
            params = params || {};
            params.workspaceTopPoint = params.workspaceTopPoint || 0;
            params.workspaceWidth = params.workspaceWidth || 0;
            params.workspaceHeight = params.workspaceHeight || 0;

            params.launcherTopPoint = params.launcherTopPoint || 0;
            params.launcherBottomPoint = params.launcherBottomPoint || 0;


            params.suggestedBloqs = params.suggestedBloqs || [];
            params.suggestedText = params.suggestedText || '';
            params.fieldOffsetTop = params.fieldOffsetTop || 0;
            params.fieldOffsetLeft = params.fieldOffsetLeft || 0;
            params.fieldOffsetRight = params.fieldOffsetRight || 0;


            showWindowCallback = params.showWindowCallback;
            console.log('params.suggestedBloqs', params.suggestedBloqs);
            showWindow();
            if (params.suggestedText) {
                setSuggestedText(params.suggestedText);
            }


            createBloqsInside(params.suggestedBloqs);
            moveWindow({
                launcherTopPoint: params.launcherTopPoint,
                launcherHeight: params.launcherHeight,
                launcherBottomPoint: params.launcherBottomPoint,
                suggestedWindowWidth: suggestedWindow.offsetWidth,
                suggestedWindowHeight: suggestedWindow.offsetHeight,
                workspaceTopPoint: params.workspaceTopPoint,
                workspaceHeight: params.workspaceHeight,
                workspaceWidth: params.workspaceWidth,
                fieldOffsetTop: params.fieldOffsetTop,
                fieldOffsetLeft: params.fieldOffsetLeft,
                fieldOffsetRight: params.fieldOffsetRight
            });
        } else {
            console.error('You must set the bloqSchemas');
        }
    }

    function showWindow() {
        if (!suggestedWindow) {
            header = createHeader();
            suggestedWindow = document.createElement('div');
            suggestedWindow.className = 'suggestion-window';

            bloqsContainer = document.createElement('div');
            bloqsContainer.className = 'bloqs-container';

            var topTriangle = document.createElement('div');
            topTriangle.className += 'triangle top';

            var bottomTriangle = document.createElement('div');
            bottomTriangle.className += 'triangle bottom';

            suggestedWindow.appendChild(topTriangle);
            suggestedWindow.appendChild(header);
            suggestedWindow.appendChild(bloqsContainer);
            suggestedWindow.appendChild(bottomTriangle);

            windowParent.appendChild(suggestedWindow);
        } else {
            suggestedWindow.className = suggestedWindow.className.replace('hide', '');
        }
        suggestedBloqs = [];
        document.addEventListener('mousedown', actionWithWindowOpenListener);
        document.addEventListener('touchstart', actionWithWindowOpenListener);
        window.addEventListener('bloqs:mousedown', actionWithWindowOpenListener);
        window.addEventListener('bloqs:dragend', onSuggestedBloqDragEnd);

        return suggestedWindow;
    }

    function hideWindow() {
        if (suggestedWindow.className.indexOf('hide') === -1) {
            suggestedWindow.className += ' hide';
        }
        document.removeEventListener('mousedown', actionWithWindowOpenListener);
        document.removeEventListener('touchstart', actionWithWindowOpenListener);
        window.removeEventListener('bloqs:mousedown', actionWithWindowOpenListener);
        window.removeEventListener('bloqs:dragend', onSuggestedBloqDragEnd);
    }

    function moveWindow(params) {
        console.log('place window in the available space', params);
        suggestedWindow.className = suggestedWindow.className.replace(' right', '');
        suggestedWindow.className = suggestedWindow.className.replace(' top', '');

        var heightExtraOffset = 3,
            widthExtraOffset = 21,
            finalPoint = {},
            bottomFreeSpace = params.workspaceHeight + params.fieldOffsetTop - params.launcherBottomPoint.top,
            topFreeSpace = params.launcherTopPoint.top - params.fieldOffsetTop,
            heightNeededSpace = params.suggestedWindowHeight + heightExtraOffset,
            rightFreeSpace = params.workspaceWidth - params.fieldOffsetRight - (params.launcherBottomPoint.left - params.fieldOffsetLeft),
            leftFreeSpace = params.launcherBottomPoint.left - params.fieldOffsetLeft,
            widthNeededSpace = params.suggestedWindowWidth + widthExtraOffset;

        if ((bottomFreeSpace >= heightNeededSpace) || (bottomFreeSpace >= topFreeSpace) || (topFreeSpace < heightNeededSpace)) {
            finalPoint.top = params.launcherBottomPoint.top - params.fieldOffsetTop + heightExtraOffset;
        } else {
            finalPoint.top = params.launcherTopPoint.top - params.fieldOffsetTop - params.suggestedWindowHeight - heightExtraOffset;
            suggestedWindow.className += ' top';
        }

        if ((rightFreeSpace >= widthNeededSpace) || (rightFreeSpace >= leftFreeSpace) || (leftFreeSpace < widthNeededSpace)) {
            finalPoint.left = params.launcherBottomPoint.left - params.fieldOffsetLeft - widthExtraOffset;
        } else {
            finalPoint.left = params.launcherBottomPoint.left - params.fieldOffsetLeft - params.suggestedWindowHeight + widthExtraOffset;
            suggestedWindow.className += ' left';
        }


        suggestedWindow.style.transform = 'translate(' + finalPoint.left + 'px,' + finalPoint.top + 'px)';
    }

    function setSuggestedText(text) {
        if (headerTitle) {
            headerTitle.innerHTML = text;
        }
    }

    function createHeader() {
        headerTitle = document.createElement('p');
        var header = document.createElement('div');
        header.className += 'header';
        header.appendChild(headerTitle);

        return header;
    }

    function actionWithWindowOpenListener(evt) {
        console.log('actionWithWindowOpenListener', evt);
        var el;
        if (evt.detail !== 1) {
            el = evt.detail;
        } else {
            el = evt.target;
        }

        if (!bloqsUtils.findAncestor(el, 'suggestion-window')) {
            bloqSelected();
        }
    }

    function createBloqsInside(bloqsToBuild) {
        var bloq,
            tempContainer;
        for (var i = 0; i < bloqsToBuild.length; i++) {
            bloq = new bloqs.Bloq({
                bloqData: bloqSchemas[bloqsToBuild[i]]
            });
            suggestedBloqs.push(bloq);
            tempContainer = document.createElement('div');
            tempContainer.className += 'bloq-container';
            tempContainer.appendChild(bloq.$bloq[0]);
            bloqsContainer.appendChild(tempContainer);

            bloq.$bloq[0].addEventListener('click', onSuggestedBloqClick);
        }

    }

    function onSuggestedBloqDragEnd(evt) {
        console.log('onSuggestedBloqDragEnd', evt.detail);
        //comprobar si está encima del input que lo llamo, o relativamente cerca, de estarlo se conecta, si no, no se conecta ya que puede haberlo arrastrado a otro sitio
        bloqSelected(evt.detail.uuid);
    }

    function onSuggestedBloqClick(evt) {
        console.log('onSuggestedBloqClick', evt);
        var eventBloq = evt.currentTarget;
        var eventBloqId = eventBloq.getAttribute('data-bloq-id');
        bloqSelected(eventBloqId);
    }

    function bloqSelected(bloqUuid) {
        for (var i = 0; i < suggestedBloqs.length; i++) {
            suggestedBloqs[i].$bloq[0].removeEventListener('click', onSuggestedBloqClick);
            if (suggestedBloqs[i].uuid !== bloqUuid) {
                suggestedBloqs[i].autoRemove();
            }
        }
        bloqsContainer.innerHTML = '';
        if (bloqUuid) {
            showWindowCallback(bloqUuid);
        }
        hideWindow();
    }

    bloqsSuggested.init = init;
    bloqsSuggested.showSuggestedWindow = showSuggestedWindow;
    bloqsSuggested.setSuggestedText = setSuggestedText;

    return bloqsSuggested;

})(window.bloqsSuggested = window.bloqsSuggested || {}, bloqsLanguages, bloqsUtils, undefined);