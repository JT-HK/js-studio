require.config({
	paths: { "js-studio": "../../src" },
});

require(["./spriteboundariestest"], function (Scene) {
	var body = document.getElementsByTagName("body")[0];
	var scene = new Scene(body);
});
