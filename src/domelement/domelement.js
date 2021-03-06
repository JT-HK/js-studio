define([
  "js-studio/mouse/mouse",
  "js-studio/keyboard/keyboard",
  "js-studio/classmanager/classmanager"
], function (Mouse, Keyboard, ClassManager) {

  var currentTabIndex = 1;

	return function (type, properties) {
    type = type || "div";
    properties = properties || {};

		var domElement = document.createElement(type);
    domElement.leftButtonDragOnly = true;

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        var propertyValue = properties[property];

        if (propertyValue !== undefined) {
          if (property === "class") {
            domElement.className = properties[property];
          } else if (property === "html") {
            domElement.innerHTML = properties[property];
          } else if (property === "muted") {
            domElement[property] = properties[property];
          } else {
            domElement.setAttribute(property, properties[property]);
          }
        }
      }
    }

    function addTabIndex () {
      if (domElement.tabIndex <= 0) {
        domElement.tabIndex = currentTabIndex++;
      }
    };

    function addMouse () {
      if (domElement.mouse === undefined) {
        domElement.mouse = new Mouse(domElement);
      }
    };

    function addKeyboard () {
      addTabIndex();

      if (domElement.keyboard === undefined) {
        domElement.keyboard = new Keyboard(domElement);
      }
    };

		domElement.onMouseDown = function (mouseDown) {
      addMouse();
      domElement.mouse.onMouseDown(mouseDown);
      return domElement;
		};

		domElement.onMouseUp = function (mouseUp) {
      addMouse();
      domElement.mouse.onMouseUp(mouseUp);
      return domElement;
		};

    domElement.onMouseMove = function (mouseMove) {
      addMouse();
      domElement.mouse.onMouseMove(mouseMove);
      return domElement;
    };

    domElement.onMouseScroll = function (mouseScroll) {
      addMouse();
      domElement.mouse.onMouseScroll(mouseScroll);
      return domElement;
    };

    domElement.onMouseDrag = function (mouseDrag) {
      addMouse();
      domElement.mouse.onMouseDrag(function (event) {
        if (domElement.leftButtonDragOnly === false || event.mouse.isLeftButton === true) {
          mouseDrag(event);
        }
      });
      return domElement;
    };

    domElement.onMouseOut = function (mouseOut) {
      addMouse();
      domElement.mouse.onMouseOut(mouseOut);
      return domElement;
    };

    domElement.onMouseClick = function (mouseClick) {
      addMouse();
      domElement.mouse.onMouseClick(function (event) {
        if (event.mouse.isLeftButton === true) {
          mouseClick(event);
        }
      });
      return domElement;
    };

    domElement.onMouseRightClick = function (mouseClick) {
      addMouse();
      domElement.mouse.onMouseClick(function (event) {
        if (event.mouse.isRightButton === true) {
          mouseClick(event);
        }
      });
      return domElement;
    };

    domElement.onDragOver = function (dragOver) {
      addMouse();
      domElement.mouse.onDragOver(dragOver);
      return domElement;
    };

    domElement.onDrop = function (drop) {
      addMouse();
      domElement.mouse.onDrop(drop);
      return domElement;
    };

    domElement.onKeyDown = function (keyDown) {
      addKeyboard();
      domElement.keyboard.onKeyDown(keyDown);
      return domElement;
    };
    domElement.onKeyUp = function (keyUp) {
      addKeyboard();
      domElement.keyboard.onKeyUp(keyUp);
      return domElement;
    };

    domElement.onFocusLost = function (focusLost) {
      addTabIndex();
      domElement.addEventListener("blur", focusLost, false);
      return domElement;
    };

    domElement.onFocusGain = function (focusGain) {
      addTabIndex();
      domElement.addEventListener("focus", focusGain, false);
      return domElement;
    };

    domElement.onChange = function (change) {
      domElement.addEventListener("change", change, false);
      return domElement;
    };

    domElement.hasClass = function (classname) {
      return ClassManager.hasClass(domElement, classname);
    };

    domElement.addClass = function (classname) {
      ClassManager.addClass(domElement, classname);
      return domElement;
    };

    domElement.removeClass = function (classname) {
      ClassManager.removeClass(domElement, classname);
      return domElement;
    };

    domElement.toggleClass = function (classname, toggleOn) {
      ClassManager.toggleClass(domElement, classname, toggleOn);
      return domElement;
    };

    domElement.setLeftButtonDragOnly = function (leftButtonDragOnly) {
      domElement.leftButtonDragOnly = leftButtonDragOnly === true;
    };

    return domElement;
  };
});
