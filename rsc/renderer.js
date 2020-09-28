/**
 * renderer.js
 * Manipulates DOM elements to display game objects. Has helper functions for
 * moving viewport (game camera) around 2D space efficiently.
 *
 * Helpful tip: There is the whole map to display, but we're constantly zooming
 * in to focus on the current player.
 */

// structure of the renderer influenced by https://stackoverflow.com/a/2206630/13158722

var defaultViewportState = {
	x: 0, // horizontal
	y: 0, // vertical
	zoom: 0, // current zoom level
	maxZoom: 10, // max zoom level
	minZoom: 0, // min zoom level
	zoomTime: 0.3, // how fast to zoom, from 0.0 to 1.0, where 0 is slow.
}

/**
 * Constructor. By default, pass the ID of the viewport.
 *
 * @param 	viewport 	Think of this as the game window, because it is.
 * @param 	settings 	Settings for the camera behavior. Change if you need to.
 * @return nothing.
 */
var Renderer = function(viewport, settings=defaultViewportState) {
	this.viewport = document.getElementById(viewport);
	this.settings = settings;
	this.tiles = []; // where tiles are virtually tracked
}

// ============================= VIEWPORT / CAMERA =============================

/**
 * Zoom and move viewport to a position and magnification.
 *
 * @param 	x 		Horizontal.
 * @param 	y 		Vertical.
 * @param 	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing
 */
Renderer.prototype.zoomTo = function(x, y, zoom) {
	this.viewport.style.cssText = '';
	this.x = x;
	this.y = y;
	this.zoom = zoom;
}

/**
 * Zoom and move viewport to a position and magnification.
 *
 * @param 	x 		Horizontal.
 * @param 	y 		Vertical.
 * @param 	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing
 */
Renderer.prototype.moveTo = function(x, y) {
	// ...
	this.x = x;
	this.y = y;
}

/**
 * Zoom out to the maximum distance.
 */
Renderer.prototype.zoomOutMax = function() {
	// ...
	this.zoom = this.maxZoom;
}

// ================================== DRAWING ==================================

/**
 * Remove all "drawn" tiles from the screen.
 * @returns 	nothing.
 */
Renderer.prototype.clear = function() {
	// ...
	this.tiles = [];
}

/**
 * Move an existing tile from its current position by a specified amount.
 *
 * @param 	id 	ID of tile given by drawAt() function.
 * @param 	dx	Delta horizontal (change in position.)
 * @param 	dy	Delta vertical (change in position.)
 */
Renderer.prototype.moveTile = function(id, dx, dy) {
	// ...
	this.tiles[id].x += dx;
	this.tiles[id].y += dy;
}

/**
 * "Draw" a tile on screen. Note: Image must already be present as an img tag in
 * the #tiles div in index.html
 *
 * @param 	imageName 	ID name of image.
 * @param 	whereX 		Horizontal position to draw.
 * @param 	whereY 			Vertical position to draw.
 * @returns 	id of tile. Used in moveTile for faster performance.
 */
Renderer.prototype.draw = function(imageName, whereX, whereY) {
	// ...
	this.tiles[this.tiles.length + 1] = {
		image: imageName,
		x: whereX,
		y: whereY
	}
}

// ================================== HELPERS ==================================

/**
 * Checks to see if the requested tile at all visible in the current viewport.
 * @returns 	True if visible, false if not.
 */
Renderer.prototype.isTileInViewport = function(tile) {
	// ...
}

// ================================== GETTERS ==================================

/**
 * Getter.
 * @returns 	Horizontal position of viewport, center of screen.
 */
Renderer.prototype.getX = function() { return viewportState.x; }

/**
 * Getter.
 * @returns 	Vertical position of viewport, center of screen.
 */
Renderer.prototype.getY = function() { return viewportState.y; }

/**
 * Getter.
 * @returns 	Zoom of viewport, center of screen.
 */
Renderer.prototype.getMagnification = function() {
	return viewportState.magnification;
}
