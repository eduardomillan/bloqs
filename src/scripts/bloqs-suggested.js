'use strict';
(function(bloqsSuggested, bloqsLanguages) {

    var suggestedWindow,
        suggestedText,
        bloqSchemas,
        windowParent,
        suggestedBloqs;

    function init(suggestionWindowParent, schemas){
        windowParent = suggestionWindowParent;
        bloqSchemas = schemas;
    }

    function showSuggestedWindow(params) {
        if(bloqSchemas){
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
            console.log('params.suggestedBloqs', params.suggestedBloqs);
            showWindow();
            moveWindow();
            createBloqsInside(params.suggestedBloqs);
        }else{
            console.error('You must set the bloqSchemas');
        }
    }

    function showWindow() {
        if (!suggestedWindow) {
            var header = createHeader();
            suggestedWindow = document.createElement('div');
            suggestedWindow.className = 'suggestion-window';
            suggestedWindow.appendChild(header);
            windowParent.appendChild(suggestedWindow);
        }else{
            suggestedWindow.className = suggestedWindow.className.replace('hide', '');
        }
        suggestedBloqs = [];
        document.addEventListener('mousedown', actionWithWindowOpenListener);
        document.addEventListener('touchstart', actionWithWindowOpenListener);

        return suggestedWindow;
    }

    function hideWindow(){
        if(suggestedWindow.className.indexOf('hide') === -1){
            suggestedWindow.className += ' hide';
        }
        document.removeEventListener('mousedown', actionWithWindowOpenListener);
        document.removeEventListener('touchstart', actionWithWindowOpenListener);
        for (var i = 0; i < suggestedBloqs.length; i++) {
            suggestedBloqs[i].$bloq[0].removeEventListener('click', onSuggestedBloqClick);
            suggestedBloqs[i].autoRemove();
        }
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

    function actionWithWindowOpenListener(evt){
        //hideWindow();
    }

    function createBloqsInside(bloqsToBuild){
        var bloq;
        for (var i = 0; i < bloqsToBuild.length; i++) {
            bloq = new bloqs.Bloq({
                bloqData: bloqSchemas[bloqsToBuild[i]]
            });
            suggestedBloqs.push(bloq);
            suggestedWindow.appendChild(bloq.$bloq[0]);
            bloq.$bloq[0].addEventListener('click', onSuggestedBloqClick );
            bloq.$bloq.off('mousedown');
            bloq.$bloq.off('touchstart');
        }

    }

    function onSuggestedBloqClick(){
        console.log('onSuggestedBloqClick');
        hideWindow();
    }

    bloqsSuggested.init = init;
    bloqsSuggested.showSuggestedWindow = showSuggestedWindow;
    bloqsSuggested.setSuggestedText = setSuggestedText;

    return bloqsSuggested;

})(window.bloqsSuggested = window.bloqsSuggested || {}, bloqsLanguages, undefined);
