'use strict';
(function(bloqsDotsMatrix, bloqsLanguages, bloqsUtils) {

    var bloqsWindow,
        dotsContainer,
        _windowParent,
        showWindowCallback,
        dots = [],
        _userIsDragging = false;

    function init(windowParent, schemas) {
        _windowParent = windowParent || _windowParent;
    }

    function showDotsWindow(params) {

        params = params || {};

        params.workspaceWidth = params.workspaceWidth || 0;
        params.workspaceHeight = params.workspaceHeight || 0;

        params.launcherTopPoint = params.launcherTopPoint || 0;
        params.launcherBottomPoint = params.launcherBottomPoint || 0;

        params.fieldOffsetTop = params.fieldOffsetTop || 0;
        params.fieldOffsetLeft = params.fieldOffsetLeft || 0;
        params.fieldOffsetRight = params.fieldOffsetRight || 0;
        params.fieldScrollTop = params.fieldScrollTop || 0;
        params.fieldScrollLeft = params.fieldScrollLeft || 0;



        showWindowCallback = params.showWindowCallback;

        showWindow(params);

        moveWindow({
            launcherTopPoint: params.launcherTopPoint,
            launcherHeight: params.launcherHeight,
            launcherBottomPoint: params.launcherBottomPoint,
            bloqsWindowWidth: bloqsWindow.offsetWidth,
            bloqsWindowHeight: bloqsWindow.offsetHeight,
            workspaceHeight: params.workspaceHeight,
            workspaceWidth: params.workspaceWidth,
            fieldOffsetTop: params.fieldOffsetTop,
            fieldOffsetLeft: params.fieldOffsetLeft,
            fieldOffsetRight: params.fieldOffsetRight,
            fieldScrollTop: params.fieldScrollTop,
            fieldScrollLeft: params.fieldScrollLeft
        });
    }

    function createDotsContent(params) {
        console.log(params.dotsMatrixOptions);
        var tempRowContainer, tempDotContainer;
        for (var i = 0; i < params.dotsMatrixOptions.options.rows; i++) {
            tempRowContainer = document.createElement('div');
            tempRowContainer.className += 'bloqs-dots-row';
            dots[i] = [];
            for (var j = 0; j < params.dotsMatrixOptions.options.columns; j++) {
                tempDotContainer = document.createElement('div');
                tempDotContainer.className += 'bloqs-dots-dot';
                dots[i].push(tempDotContainer);
                //dots[i][j].addEventListener('click', toggleDot);
                dots[i][j].addEventListener('mouseover', overDot);

                tempRowContainer.appendChild(tempDotContainer);
            }
            dotsContainer.appendChild(tempRowContainer); //TODO just 1 append function on bloqsutils
        }
    };

    function getMatrix() {
        var result = [];
        for (var i = 0; i < dots.length; i++) {
            result[i] = [];
            for (var j = 0; j < dots[i].length; j++) {
                result[i][j] = (dots[i][j].className.indexOf('active') !== -1);
            }
        }
        console.log(result);
        return result;
    }

    function toggleDot(evt) {
        var dot = evt.target;
        if (dot.className.indexOf('active') === -1) {
            dot.className += ' active';
        } else {
            dot.className = dot.className.replace('active', '');
        }
        getMatrix();
    }

    function overDot(evt) {
        console.log('over');
        if (_userIsDragging) {
            var dot = evt.target;
            if (dot.className.indexOf('active') === -1) {
                dot.className += ' active';
            }
        }
    }

    function showWindow(params) {
        if (!bloqsWindow) {
            bloqsWindow = document.createElement('div');
            bloqsWindow.className = 'dotsMatrix-window';

            dotsContainer = document.createElement('div');
            dotsContainer.className = 'dots-container';

            var topTriangle = document.createElement('div');
            topTriangle.className += 'triangle top';

            var bottomTriangle = document.createElement('div');
            bottomTriangle.className += 'triangle bottom';

            createDotsContent(params);

            bloqsWindow.addEventListener('mousedown', function(evt) {
                bloqsWindow.addEventListener('mouseup', function() {
                    _userIsDragging = false;
                });
                bloqsWindow.addEventListener('mouseleave', function() {
                    _userIsDragging = false;
                });
                _userIsDragging = true;
                toggleDot(evt);
                console.log('activating');

            });

            bloqsWindow.appendChild(topTriangle);

            bloqsWindow.appendChild(dotsContainer);
            bloqsWindow.appendChild(bottomTriangle);

            _windowParent.appendChild(bloqsWindow);
        } else {
            bloqsWindow.className = bloqsWindow.className.replace('hide', '');
        }
        document.addEventListener('mousedown', actionWithWindowOpenListener);
        document.addEventListener('touchstart', actionWithWindowOpenListener);
        window.addEventListener('bloqs:mousedown', actionWithWindowOpenListener);

        return bloqsWindow;
    }

    function hideWindow() {
        if (bloqsWindow.className.indexOf('hide') === -1) {
            bloqsWindow.className += ' hide';
        }
        document.removeEventListener('mousedown', actionWithWindowOpenListener);
        document.removeEventListener('touchstart', actionWithWindowOpenListener);
        window.removeEventListener('bloqs:mousedown', actionWithWindowOpenListener);
        window.removeEventListener('bloqs:dragend', onSuggestedBloqDragEnd);
    }

    function moveWindow(params) {
        console.log('place window in the available space', params);
        bloqsWindow.className = bloqsWindow.className.replace(' right', '');
        bloqsWindow.className = bloqsWindow.className.replace(' top', '');

        var heightExtraOffset = 6,
            widthExtraOffset = 21,
            finalPoint = {},
            bottomFreeSpace = params.workspaceHeight + params.fieldOffsetTop - params.launcherBottomPoint.top,
            topFreeSpace = params.launcherTopPoint.top - params.fieldOffsetTop,
            heightNeededSpace = params.bloqsWindowHeight + heightExtraOffset,
            rightFreeSpace = params.workspaceWidth - params.fieldOffsetRight - (params.launcherBottomPoint.left - params.fieldOffsetLeft),
            leftFreeSpace = params.launcherBottomPoint.left - params.fieldOffsetLeft,
            widthNeededSpace = params.bloqsWindowWidth + widthExtraOffset;

        if ((bottomFreeSpace >= heightNeededSpace) || (bottomFreeSpace >= topFreeSpace) || (topFreeSpace < heightNeededSpace)) {
            finalPoint.top = params.launcherBottomPoint.top - params.fieldOffsetTop + heightExtraOffset + params.fieldScrollTop;
        } else {
            finalPoint.top = params.launcherTopPoint.top - params.fieldOffsetTop - params.bloqsWindowHeight - heightExtraOffset + params.fieldScrollTop;
            bloqsWindow.className += ' top';
        }

        if ((rightFreeSpace >= widthNeededSpace) || (rightFreeSpace >= leftFreeSpace) || (leftFreeSpace < widthNeededSpace)) {
            finalPoint.left = params.launcherBottomPoint.left - params.fieldOffsetLeft - widthExtraOffset + params.fieldScrollLeft;
        } else {
            finalPoint.left = params.launcherBottomPoint.left - params.fieldOffsetLeft - params.bloqsWindowHeight + widthExtraOffset + params.fieldScrollLeft;
            bloqsWindow.className += ' left';
        }


        bloqsWindow.style.transform = 'translate(' + finalPoint.left + 'px,' + finalPoint.top + 'px)';
    }


    function actionWithWindowOpenListener(evt) {
        console.log('actionWithWindowOpenListener', evt);
        var el;
        if (evt.detail !== 1) {
            el = evt.detail;
        } else {
            el = evt.target;
        }
    }


    function onSuggestedBloqDragEnd(evt) {
        console.log('onSuggestedBloqDragEnd', evt.detail.bloq);
        //comprobar si está encima del input que lo llamo, o relativamente cerca, de estarlo se conecta, si no, no se conecta ya que puede haberlo arrastrado a otro sitio
        bloqSelected(evt.detail.bloq.uuid);
    }


    function close() {
        dotsContainer.innerHTML = '';
        showWindowCallback();
        hideWindow();
    }

    bloqsDotsMatrix.init = init;
    bloqsDotsMatrix.showDotsWindow = showDotsWindow;

    return bloqsDotsMatrix;

})(window.bloqsDotsMatrix = window.bloqsDotsMatrix || {}, bloqsLanguages, bloqsUtils, undefined);