// draw_test.js
var renderer = new Renderer('background-layer', 'tiles');
renderer.drawMap(level0);

document.getElementById("reset").onclick = function(event) {
	renderer.moveViewport(0, 0, 0);
};

document.getElementById("zoomin").onclick = function(event) {
	renderer.setZoom(renderer.getZoom() + 1);
};

document.getElementById("zoomout").onclick = function(event) {
	renderer.setZoom(renderer.getZoom() - 1);
};

document.getElementById("moveup").onclick = function(event) {
	renderer.shiftViewport(0, -25);
};

document.getElementById("moveright").onclick = function(event) {
	renderer.shiftViewport(25, 0);
};

document.getElementById("movedown").onclick = function(event) {
	renderer.shiftViewport(0, 25);
};

document.getElementById("moveleft").onclick = function(event) {
	renderer.shiftViewport(-25, 0);
};
