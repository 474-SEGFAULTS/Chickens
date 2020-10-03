/**
 * renderer.js
 *
 * Manipulates DOM elements to display game objects. Has helper functions for
 * moving viewport (game camera) around 2D space efficiently.
 *
 * The critical functions
 * renderer.zoomTo(x, y, zoom) zooms you in to an x, y position with a zoom.
 * renderer.zoomOutMax() zooms out the maximum possible distance.
 * renderer.draw(imageName, whereX, whereY) "draws" in an image in the viewport.
 */

// structure of the renderer influenced by https://stackoverflow.com/a/2206630/13158722

var defaultViewportState = {
	x: 0, // horizontal position of viewport
	y: 0, // vertical position of viewport
	zoom: 0, // current zoom level of viewport
	maxZoom: 10, // max zoom level
	minZoom: 0 // min zoom level
}

/**
 * Constructor. By default, pass the ID of the viewport.
 *
 * @param 	viewport 	Think of this as the game window, because it is.
 * @param 	tileSource 	Where the tiles come from to draw from.
 * @param 	settings 	Settings for the camera behavior. Change if you need to.
 * @return nothing.
 */
var Renderer = function(viewport, tileSource, settings=defaultViewportState) {
	this.viewport = document.getElementById(viewport);
	this.tileSource = document.getElementById(tileSource);
	this.settings = settings; // settings is more like the state of the viewport
	this.tiles = []; // where tiles are virtually tracked

	window.onresize = function() {
		renderer.viewport.setAttribute('style', 'width: ' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px;');
	};
}

// ============================= VIEWPORT / CAMERA =============================

/**
 * Internal function to double check that the zoom level is valid.
 *
 * @param 	zoom 	Zoom level being checked.
 * @return nothing.
 * @throws 2 exceptions.
 */
Renderer.prototype.checkZoom = function(zoom) {
	if(zoom > this.settings.maxZoom || zoom < this.settings.minZoom)
		throw 'Specified zoom level is beyond max/mins.';
	if(this.settings.maxZoom < this.settings.minZoom)
		throw 'Renderer settings maxZoom is less than minZoom';
}

/**
 * Change the camera's zoom level.
 *
 * @param 	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing
 */
Renderer.prototype.setZoom = function(zoom) {
	this.checkZoom(zoom);
	this.settings.zoom = zoom;
	this.updateViewport();
}

/**
 * Helper function. Updates the viewport CSS to the new state.
 * @return nothing
 */
Renderer.prototype.updateViewport = function() {
	this.viewport.setAttribute(
		'style',
		'transform: ' +
		this.generateZoomCSS(this.settings.zoom) + ' ' +
		this.generateTranslateCSS(this.settings.x, this.settings.y) + ';'
	);
}

/**
 * Generate the necessary CSS scale function.
 *
 * @param 	zoom 	Current zoom level.
 * @return the CSS that zooms in the viewport.
 */
Renderer.prototype.generateZoomCSS = function(zoom) {
	var zoomCSS = '';
	if(zoom == this.settings.minZoom) {
		zoomCSS = 'scale(1.0)';
	} else {
		zoomCSS = 'scale(' +
		(
			(this.settings.maxZoom - this.settings.minZoom)
			/
			(this.settings.maxZoom - zoom)
		) + ')';
	}
	return zoomCSS;
}

/**
 * Generate the necessary CSS translate function to move the viewport.
 *
 * @param 	whereX 		Horizontal position.
 * @param 	whereY 		Vertical position.
 * @return nothing.
 */
Renderer.prototype.generateTranslateCSS = function(whereX, whereY) {
	// -1 to invert the positions since translate is normally opposite what we
	// want to translate to.
	return 'translate(' + (-1 * whereX) + 'px, ' + (-1 * whereY) + 'px)';
}

/**
 * Zoom and move viewport to a position and magnification.
 *
 * @param 	x 		Horizontal.
 * @param 	y 		Vertical.
 * @param 	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing
 */
Renderer.prototype.zoomTo = function(x, y, zoom) {
	this.checkZoom(zoom);
	this.settings.x = x;
	this.settings.y = y;
	this.settings.zoom = zoom;
	this.updateViewport();
}

/**
 * Zoom and move viewport to a new position.
 *
 * @param 	x 		Horizontal.
 * @param 	y 		Vertical.
 * @param 	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing
 */
Renderer.prototype.moveTo = function(x, y) {
	this.settings.x = x;
	this.settings.y = y;
	this.updateViewport();
}

/**
 * Shift the current viewport position by a translational amount.
 *
 * @param 	x 		Horizontal translation.
 * @param 	y 		Vertical translation.
 * @param 	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing
 */
Renderer.prototype.shiftTo = function(dx, dy) {
	this.settings.x += dx;
	this.settings.y += dy;
	this.updateViewport();
}

/**
 * Zoom out to the maximum distance.
 * @return nothing
 */
Renderer.prototype.zoomOutMax = function() {
	this.setZoom(this.settings.minZoom);
	this.settings.zoom = this.settings.maxZoom;
}

// ================================== DRAWING ==================================

/**
 * Remove all "drawn" tiles from the screen.
 * @returns 	nothing.
 */
Renderer.prototype.clear = function() {
	this.viewport.innerHTML = '';
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
	this.tiles[id].x += dx;
	this.tiles[id].y += dy;
	this.viewport.children[id].setAttribute(
		'style',
		'top: ' + (this.tiles[id].y += dy) + // update virtual positions and DOM
		'px; left: ' + (this.tiles[id].x += dx) + 'px;'
	);
}

/**
 * "Draw" a tile on screen. Note: Image must already be present as an img tag in
 * the #tiles div in index.html
 *
 * @param 	imageName 	ID name of image.
 * @param 	whereX 		Horizontal position to draw.
 * @param 	whereY 		Vertical position to draw.
 * @returns 	id of tile. Used in moveTile for faster performance.
 */
Renderer.prototype.draw = function(imageName, whereX, whereY) {
	var newImage = document.createElement('img');
	var newID = this.tiles.length + 1
	newImage.id = newID;
	newImage.src = this.tileSource.children[imageName].src;
	newImage.width = this.tileSource.children[imageName].width;
	newImage.height = this.tileSource.children[imageName].height;
	newImage.classList = 'go'; // game object class, see main.css
	newImage.setAttribute(
		'style',
		'top: ' + whereY + // update virtual positions and DOM
		'px; left: ' + whereX + 'px;'
	);
	this.viewport.appendChild(newImage);
	this.tiles[this.tiles.length + 1] = {
		image: imageName,
		x: whereX,
		y: whereY
	};
	return newID;
}

// ================================== HELPERS ==================================

Renderer.prototype.resizeViewport = function() {
	renderer.viewport.setAttribute('style', 'width: ' + document.width + 'px; height: ' + document.height + 'px;');
}

/**
 * Checks to see if the requested tile at all visible in the current viewport.
 * Is used for hiding tiles that are no longer visible.
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
Renderer.prototype.getX = function() { return this.settings.x; }

/**
 * Getter.
 * @returns 	Vertical position of viewport, center of screen.
 */
Renderer.prototype.getY = function() { return this.settings.y; }

/**
 * Getter.
 * @returns 	Zoom of viewport, center of screen.
 */
Renderer.prototype.getZoom = function() {
	return this.settings.zoom;
}

/**
 * Getter.
 * @returns 	All the tiles currently "rendered" in the viewport.
 */
Renderer.prototype.getTiles = function() {
	return this.tiles;
}
