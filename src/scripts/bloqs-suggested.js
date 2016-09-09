'use strict';
(function(bloqsSuggested, bloqsLanguages) {

    var suggestedWindow,
        suggestedText;

    function showSuggestedWindow(params) {
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

        createWindow();
        //moveWindow();
        //createBloqsInside();
    }

    function createWindow() {
        if (!suggestedWindow) {
            var header = createHeader();
            suggestedWindow = document.createElement('div');
            suggestedWindow.className += ' suggestion-window';
            suggestedWindow.appendChild(header);
        }

        return suggestedWindow;
    }

    function moveWindow() {

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

    bloqsSuggested.showSuggestedWindow = showSuggestedWindow;
    bloqsSuggested.setSuggestedText = setSuggestedText;

    return bloqsSuggested;

})(window.bloqsSuggested = window.bloqsSuggested || {}, bloqsLanguages, undefined);