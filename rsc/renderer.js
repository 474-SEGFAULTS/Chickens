/**
 * renderer.js
 * Manipulates DOM elements to display game objects. Has helper functions for
 * moving viewport (game camera) around 2D space efficiently.
 *
 * Helpful tip: There is the whole map to display, but we're constantly zooming
 * in to focus on the current player.
 */

// ...

var viewportState = {
	x: 0,
	y: 0,
	magnification: 0,
	tiles: []
}

// ============================= VIEWPORT / CAMERA =============================

/**
 *
 *
 */
function zoomTo(x, y, magnification) {

}

/**
 *
 *
 */
function moveTo(x, y) {

}

/**
 *
 *
 */
function zoomOutMax() {

}

// ================================== DRAWING ==================================

/**
 * Remove all "drawn" tiles from the screen.
 * @returns 	nothing.
 */
function clear() {

}

/**
 * "Draw" a tile on screen. Note: Image must already be present as an img tag in
 * the #tiles div in index.html
 *
 * @param 	imageName 	ID name of image.
 * @param 	x 			Horizontal position to draw.
 * @param 	y 			Vertical position to draw.
 * @returns 	nothing.
 */
function drawAt(imageName, x, y) {

}

// ================================== HELPERS ==================================

/**
 * Checks to see if the requested tile at all visible in the current viewport.
 * @returns 	True if visible, false if not.
 */
function isTileInViewport(tile) {

}

// ================================== GETTERS ==================================

/**
 * Getter.
 * @returns 	Horizontal position of viewport, center of screen.
 */
function getX() { return viewportState.x; }

/**
 * Getter.
 * @returns 	Vertical position of viewport, center of screen.
 */
function getY() { return viewportState.y; }

/**
 * Getter.
 * @returns 	Zoom of viewport, center of screen.
 */
function getMagnification() { return viewportState.magnification; }
