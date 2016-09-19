'use strict';
(function(bloqsSuggested, bloqsLanguages, bloqsUtils) {

    var suggestedWindow,
        header,
        bloqsContainer,
        suggestedText,
        bloqSchemas,
        windowParent,
        suggestedBloqs,
        showWindowCallback;

    function init(suggestionWindowParent, schemas) {
        windowParent = suggestionWindowParent;
        bloqSchemas = schemas;
    }

    function showSuggestedWindow(params) {
        if (bloqSchemas) {
            params = params || {};
            params.workspaceX = params.workspaceX || 0;
            params.workspaceY = params.workspaceY || 0;
            params.workspaceWidth = params.workspaceWidth || 0;
            params.workspaceHeight = params.workspaceHeight || 0;

            params.launchWindowItemX = params.launchWindowItemX || 0;
            params.launchWindowItemY = params.launchWindowItemY || 0;
            params.launchWindowItemWidth = params.launchWindowItemWidth || 0;
            params.launchWindowItemHeight = params.launchWindowItemHeight || 0;

            params.suggestedBloqs = params.suggestedBloqs || [];
            params.suggestedText = params.suggestedText || suggestedText || '';

            showWindowCallback = params.showWindowCallback;
            console.log('params.suggestedBloqs', params.suggestedBloqs);
            showWindow();
            moveWindow();
            createBloqsInside(params.suggestedBloqs);
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

            suggestedWindow.appendChild(header);
            suggestedWindow.appendChild(bloqsContainer);

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

    function moveWindow() {
        console.log('place window in the available space');
    }

    function setSuggestedText(text) {
        suggestedText = text;
        if (suggestedWindow) {
            //suggestedWindow.suggestedText //TODO
        }
    }

    function createHeader() {
        var title = document.createElement('p');
        title.innerHTML = suggestedText;
        var header = document.createElement('div');
        header.className += 'header';
        header.appendChild(title);

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