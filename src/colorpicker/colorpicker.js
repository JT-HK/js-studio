define([
	"module",
	"js-studio/mouse/mouse",
	"js-studio/mouse/mouselistener",
	"js-studio/domelement/domelement",
	"js-studio/cssloader/cssloader",
	"js-studio/colorutils/colorutils"
], function (Module, Mouse, MouseListener, DOMElement, CSSLoader, ColorUtils) {

	var currentDirectory = Module.uri.replace("colorpicker.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "colorpicker.css");

	return function (options) {
		var colorPicker = new DOMElement("div", { id: options && options.id, class: "colorPicker" });
		colorPicker.colorChanged = options.colorChanged || function () {};
		colorPicker.panelOpened = options.panelOpened || function () {};
		colorPicker.showPanel = function (show) {
			colorPickerDialog.toggleClass("show", show);
			if (colorPickerDialog.hasClass("show") === true) {
				colorPicker.panelOpened();
			}
		};

		var colorPalette = new DOMElement("div", { class: "colorPalette" });
		colorPalette.onMouseClick(function () {
			colorPicker.showPanel();
		});
		colorPicker.appendChild(colorPalette);

		var colorPickerDialog = new DOMElement("div", { class: "colorPickerDialog" });
		colorPicker.appendChild(colorPickerDialog);

		var colorPickerPanel = new DOMElement("div", { class: "colorPickerPanel" });
		colorPickerDialog.appendChild(colorPickerPanel);

		var colorBoard = new DOMElement("div", { class: "colorBoard" });
		colorBoard.style.background = "rgb(255, 0, 0)";
		colorPickerPanel.appendChild(colorBoard);

		var colorBoardGradient = new DOMElement("div", { class: "colorBoardGradient" });
		colorBoard.appendChild(colorBoardGradient);

		var colorBoardPointer = new DOMElement("div", { class: "colorBoardPointer" });
		colorBoardPointer.style.top = "100%";
		colorBoardPointer.style.left = "100%";
		colorBoardGradient.appendChild(colorBoardPointer);

		var colorBoardOverlay = new DOMElement("div", { class: "colorBoardOverlay" });
		function colorBoardMouseEvent (event) {
			if (event.which !== 1) {
				return;
			}

			var x = event.mouse.position.x;
			var y = event.mouse.position.y;
			var width = colorBoardOverlay.offsetWidth;
			var height = colorBoardOverlay.offsetHeight;
			var topPercentage = Math.max(0, Math.min(height, y)) / height * 100;
			var leftPercentage = Math.max(0, Math.min(width, x)) / height * 100;

			colorBoardPointer.style.top = topPercentage + "%";
			colorBoardPointer.style.left = leftPercentage + "%";

			changeColor();
		};
		colorBoardOverlay.onMouseDrag(colorBoardMouseEvent);
		colorBoardOverlay.onMouseDown(colorBoardMouseEvent);
		colorBoard.appendChild(colorBoardOverlay);

		var hueBanner = new DOMElement("div", { class: "hueBanner" });
		colorPickerPanel.appendChild(hueBanner);
		function onHueChanged (percentage) {
			percentage = Math.max(0, Math.min(100, percentage));

			var hueColor = ColorUtils.hsvToRGB(percentage / 100 * 360, 1, 1);

			hueBannerThumb.style.top = percentage + "%";
			colorBoard.style.background = "rgb(" + hueColor.r + ", " + hueColor.g + ", " + hueColor.b + ")";
			changeColor();
		};
		function hueMouseEvent (event) {
			if (event.which !== 1) {
				return;
			}

			var bannerHeight = hueBanner.offsetHeight;
			var position = event.mouse.position.y;
			var percentage = position / bannerHeight * 100;

			onHueChanged(percentage);
		};
		function hueKeyEvent (event) {
			var keyCode = event.which || event.keyCode;

			/* up key is pressed */
			if (keyCode === 38) {
				onHueChanged(parseInt(hueBannerThumb.style.top) - 1);
			}
			/* down key is pressed */
			else if (keyCode === 40) {
				onHueChanged(parseInt(hueBannerThumb.style.top) + 1);
			}
	 	};
		hueBanner.onMouseDown(hueMouseEvent);
		hueBanner.onMouseDrag(hueMouseEvent);
		hueBanner.onKeyDown(hueKeyEvent);
		var hueBannerThumb = new DOMElement("div", { class: "hueBannerThumb" });
		hueBannerThumb.style.top = "0%";
		hueBanner.appendChild(hueBannerThumb);

		var alphaBanner = new DOMElement("div", { class: "alphaBanner" });
		function onAlphaChanged (percentage) {
			percentage = Math.max(0, Math.min(100, percentage));

			alphaBannerThumb.style.left = percentage + "%";
			changeColor();
		};
		function alphaMouseEvent (event) {
			if (event.which !== 1) {
				return;
			}

			var bannerWidth = alphaBanner.offsetWidth;
			var position = event.mouse.position.x;
			var percentage = position / bannerWidth * 100;

			onAlphaChanged(percentage);
		};
		function alphaKeyEvent (event) {
			var keyCode = event.which || event.keyCode;

			/* left key is pressed */
			if (keyCode === 37) {
				onAlphaChanged(parseInt(alphaBannerThumb.style.left) - 1);
			}
			/* right key is pressed */
			else if (keyCode === 39) {
				onAlphaChanged(parseInt(alphaBannerThumb.style.left) + 1);
			}
		};
		alphaBanner.onMouseDown(alphaMouseEvent);
		alphaBanner.onMouseDrag(alphaMouseEvent);
		alphaBanner.onKeyDown(alphaKeyEvent);
		colorPickerPanel.appendChild(alphaBanner);

		var alphaBannerOverlay = new DOMElement("div", { class: "alphaBannerOverlay" });
		alphaBanner.appendChild(alphaBannerOverlay);

		var alphaBannerThumb = new DOMElement("div", { class: "alphaBannerThumb" });
		alphaBannerThumb.style.left = "0%";
		alphaBanner.appendChild(alphaBannerThumb);

		colorPicker.setColor = function (color) {
			if (ColorUtils.isValidColor(color)) {
				var hsv = ColorUtils.rgbToHSV(color.r, color.g, color.b);
				color.a = color.a || 1;

				colorPalette.style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
				hueBannerThumb.style.top = (hsv.h / 360 * 100) + "%";
				colorBoard.style.background = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
				colorBoardPointer.style.top = ((1 - hsv.v) * 100) + "%";
				colorBoardPointer.style.left = (hsv.s * 100) + "%";
				alphaBanner.style.background = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
				alphaBannerThumb.style.left = (color.a * 100) + "%";
			}
		};

		if (options.color !== undefined) {
			colorPicker.setColor(options.color);
		}

		function changeColor () {
			var hue = parseFloat(hueBannerThumb.style.top) / 100 * 360;
			var saturation = parseFloat(colorBoardPointer.style.left) / 100;
			var value = 1 - (parseFloat(colorBoardPointer.style.top) / 100);
			var alpha = parseFloat(alphaBannerThumb.style.left) / 100;
			var color = ColorUtils.hsvToRGB(hue, saturation, value);
			color.a = alpha;

			alphaBanner.style.background = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
			colorPalette.style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";

			colorPicker.colorChanged(color);
		};

		return colorPicker;
	};
});
