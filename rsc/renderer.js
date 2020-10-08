/**
 * renderer.js
 *
 * Manipulates DOM elements to display game objects. Has helper functions for
 * moving viewport (game camera) around 2D space efficiently.
 *
 * The critical functions
 * renderer.moveViewport(x, y, zoom) zooms you in to an x, y position with a zoom.
 * renderer.zoomOutMax() zooms out the maximum possible distance.
 * renderer.draw(imageName, whereX, whereY) "draws" in an image in the viewport.
 *
 * "shift" means currentX += deltaX as in shiftTile, shiftViewport
 * "move" means currentX = newX as in moveTile, moveViewport
 *
 * whereX and whereY are used instead of just x and y when there's already an x
 * and y within scope.
 *
 * Any function relating to "chunks" was hoping to draw each individual chunk to
 * the screen in order to get destruction physics, but it's not acheivable in
 * the remaining.
 *
 * @author jvillemare
 * @date 2019-10-06
 */

// structure of the renderer influenced by
// https://stackoverflow.com/a/2206630/13158722

var defaultViewportState = {
	x: 0, // horizontal position of viewport
	y: 0, // vertical position of viewport
	zoom: 0, // current zoom level of viewport
	maxZoom: 10, // max zoom level
	minZoom: 0, // min zoom level
	chunkSize: 10, // 10 x 10
};

// ================================ CONSTRUCTOR ================================

/**
 * Constructor. By default, pass the ID of the viewport.
 *
 * @param 	{selector} viewport 	Think of this as the game window, because it
 *									is.
 * @param 	{selector} tileSource 	Where the tiles come from to draw from.
 * @param 	{dictionary} settings 	Settings for the camera behavior. Change if
 *									you need to.
 * @return nothing.
 * @author jvillemare
 */
var Renderer = function(viewport, tileSource, settings=defaultViewportState) {
	this.viewport = document.getElementById(viewport);
	this.tileSource = document.getElementById(tileSource);
	this.settings = settings; // settings is more like the state of the viewport
	this.tiles = []; // where tiles are virtually tracked
	this.map = null; // map layer itself
	this.mapTiles = 0; // if drawing by map, use this for unique DOM ids
	this.chunks = []; // id of chunks created
	this.chunksNodes = []; // nodes of chunk to quickly add
	this.chunksUsed = false; // indicate if chunks are being used
	this.mapDimensions = {}; // map dimensions for calculating positions

	window.onresize = function() {
		renderer.viewport.setAttribute('style', 'width: ' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px;');
	};
};

// ============================== PLAYER MOVEMENT ==============================

/**
 * Checks to see if there is any "ground" beneath a specified x and y within a
 * range. Helpful for checking if a player is on ground, and if not, apply
 * gravity to the player.
 *
 * @param 	{int} 	x 		Horizontal position.
 * @param 	{int}	y 		Vertical position.
 * @param 	{int} 	range 	Range beneath x, y to look.
 * @returns {boolean}	True if there's ground beneath, False if not.
 * @author jvillemare
 */
Renderer.prototype.isGroundBeneath = function(x, y, range) {
	for(var look = 0; look < range; look++) {
		if(this.map[this.convert2Dto1D(x, y + look, this.mapDimensions.width)] != 0) { // note: if this isn't working, use y - look instead
			// i can't tell which way is up, anymore
			return true;
		}
	}
	return false;
};

// ============================= VIEWPORT / CAMERA =============================

/**
 * Internal function to double check that the zoom level is valid.
 *
 * @param 	{int}	zoom 	Zoom level being checked.
 * @return nothing.
 * @throws 2 exceptions.
 * @author jvillemare
 */
Renderer.prototype.checkZoom = function(zoom) {
	if(zoom > this.settings.maxZoom || zoom < this.settings.minZoom)
		throw 'Specified zoom level is beyond max/mins.';
	if(this.settings.maxZoom < this.settings.minZoom)
		throw 'Renderer settings maxZoom is less than minZoom';
};

/**
 * Change the camera's zoom level.
 *
 * @param 	{int}	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.setZoom = function(zoom) {
	this.checkZoom(zoom);
	this.settings.zoom = zoom;
	this.updateViewport();
};

/**
 * Helper function. Updates the viewport CSS to the new state.
 *
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.updateViewport = function() {
	this.viewport.setAttribute(
		'style',
		'transform: ' +
		this.generateZoomCSS(this.settings.zoom) + ' ' +
		this.generateTranslateCSS(this.settings.x, this.settings.y) + ';'
	);
};

/**
 * Generate the necessary CSS scale function.
 *
 * @param 	{int}	zoom 	Current zoom level.
 * @return the CSS that zooms in the viewport.
 * @author jvillemare
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
};

/**
 * Generate the necessary CSS translate function to move the viewport.
 *
 * @param 	{int}	whereX 		Horizontal position.
 * @param 	{int}	whereY 		Vertical position.
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.generateTranslateCSS = function(whereX, whereY) {
	// -1 to invert the positions since translate is normally opposite what we
	// want to translate to.
	return 'translate(' + (-1 * whereX) + 'px, ' + (-1 * whereY) + 'px)';
};

/**
 * Zoom and move viewport to a position and magnification.
 *
 * @param 	{int}	x 		Horizontal.
 * @param 	{int}	y 		Vertical.
 * @param 	{int}	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.moveViewport = function(x, y, zoom) {
	this.checkZoom(zoom);
	this.settings.x = x;
	this.settings.y = y;
	this.settings.zoom = zoom;
	this.updateViewport();
};

/**
 * Zoom and move viewport to a new position.
 *
 * @param 	{int}	x 		Horizontal.
 * @param 	{int}	y 		Vertical.
 * @param 	{int}	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.moveViewport = function(x, y) {
	this.settings.x = x;
	this.settings.y = y;
	this.updateViewport();
};

/**
 * Shift the current viewport position by a translational amount.
 *
 * @param 	{int}	x 		Horizontal translation.
 * @param 	{int}	y 		Vertical translation.
 * @param 	{int}	zoom	viewportState.minZoom < zoom < viewportState.maxZoom
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.shiftViewport = function(dx, dy) {
	this.settings.x += dx;
	this.settings.y += dy;
	this.updateViewport();
};

/**
 * Zoom out to the maximum distance.
 * @return nothing
 * @author jvillemare
 */
Renderer.prototype.zoomOutMax = function() {
	this.setZoom(this.settings.minZoom);
	this.settings.zoom = this.settings.maxZoom;
};

// ================================== DRAWING ==================================

/**
 * Remove all "drawn" tiles from the screen.
 * @returns 	nothing.
 * @author jvillemare
 */
Renderer.prototype.clear = function() {
	this.viewport.innerHTML = '';
	this.tiles = [];
};

/**
 * Draw a "sprite" (sub-image) from a tileset at an x and y.
 *
 * @param 	{int}	tileID 		ID of tilesheet in tileSource.
 * @param 	{int}	spriteID	ID of sprite in tilesheet.
 * @param 	{int} 	whereX 		Horizontal position to draw.
 * @param 	{int} 	whereY			Vertical position to draw.
 * @return	{int} 	ID of drawn sprite in renderer. Is used when moving drawn
 *					sprites with Renderer.moveTile
 * @author jvillemare
 */
Renderer.prototype.drawFromTileset = function(tileID, spriteID, whereX, whereY) {
	var newSprite = document.createElement('div');
	var newID = this.tiles.length + 1;
	var spriteID = 't' + tileID;
	newSprite.id = newID;
	newSprite.classList = spriteID; // game object class, see main.css
	newSprite.setAttribute(
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
};

/**
 * Calculate the distance between two points in 2D space.
 *
 * @param {int} x1 First horizontal.
 * @param {int} y1 First vertical.
 * @param {int} x2 Second horizontal.
 * @param {int} y2 Second vertical.
 * @return {float} distance between the two points.
 * @author jvillemare
 */
Renderer.prototype.twoDimensionalDistance = function(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	return Math.sqrt(a*a + b*b);
};

/**
 * Delete tiles that are in chunks with a radius of an x and y.
 *
 * @param 	{int} 	whereX 		Horizontal position to draw.
 * @param 	{int} 	whereY			Vertical position to draw.
 * @param 	{int}	spriteID	ID of sprite in tilesheet.
 * @return	{int} 	ID of drawn sprite in renderer. Is used when moving drawn
 *					sprites with Renderer.moveTile
 * @see Renderer.drawMap(...)
 * @author jvillemare
 */
Renderer.prototype.deleteChunkTilesInRadius = function(whereX, whereY, radius) {
	if(this.chunksUsed == false)
		throw 'Chunks are not being used, and tiles within them cannot be deleted. Must call drawMap() before this.';
	// ...
};

/**
 * Determine what chunk a map tile belongs to given it's one-dimensional ID.
 *
 * @param 	{int} 	id 			Give the number of the chunk starting from 0
 *								onwards of where a tile belongs.
 * @param 	{int} 	width 		The width of the tileset data.
 * @param 	{int}	chunkSize	Size of the chunks.
 * @return {int} give the number of the chunk starting from 0 onwards of where a
 *				 tile belongs.
 * @author jvillemare
 */
Renderer.prototype.getChunkID = function(positions, width, chunkSize) {
	if(chunkSize < 0)
		throw 'Chunk size cannot be less than 0';
	if(positions.length != 2) {
		console.log(positions);
		throw 'convert1Dto2D failed to return an array of two elements, instead got the above output.';
	}
	return (Math.floor(positions[0] / chunkSize)) +
		(Math.floor(positions[1] / chunkSize) * Math.floor(width / chunkSize));
		// figure out horizontal, then
		// vertical needs to figure offset, and then how many chunks skipped
};

/**
 * Checks if a chunk exists in the viewport. If it does not, this function
 * appends a new chunk div element to the viewport.
 *
 * @param 	{int}	id 		ID of the chunk.
 * @return 	{bool} 	true if the chunk exists, false if not.
 * @author jvillemare
 */
Renderer.prototype.chunkDoesExist = function(id) {
	if(this.chunks.includes(id) == false) {
		var newChunk = document.createElement('div');
		newChunk.id = 'chunk-' + id;
		this.viewport.appendChild(newChunk);
		this.chunks.push(id);
		this.chunksNodes[id] = newChunk;
		return false;
	}
	return true;
};

/**
 * Internal helper function.
 * Convert a one dimensional coordinate to two dimension based on the width and
 * height specified by the level JSON loaded by drawMap().
 *
 * @param 	{int} 	x 			Horizontal in one dimensions.
 * @param 	{int} 	mapWidth	Width of the map in pixels.
 * @return  {array} [x, y]
 * @see Renderer.drawMap(...)
 * @author jvillemare
 */
Renderer.prototype.convert1Dto2D = function(x, mapWidth) {
	if(this.chunksUsed == false)
		throw 'Width and height not know because no map JSON was loaded with drawMap()';
	if(x == null)
		throw 'Given a null x. It should not be null';
	if(x >= mapWidth * mapWidth)
		throw 'x is greater than map dimensions';
	return [
		(x % mapWidth), // x
		Math.floor(x / mapWidth) // y
	];
};

/**
 * Internal, static helper function.
 * Convert a two dimensional coordinate to one dimension based on the width and
 * height specified by the level JSON loaded by drawMap().
 *
 * @param 	{int} 	x 			Horizontal in two dimensions.
 * @param 	{int} 	y			Vertical in two dimensions.
 * @param	{int}	mapWidth 	Width of map in pixels.
 * @return	{int} Horziontal in one dimension.
 * @author jvillemare
 * @see Renderer.drawMap(...)
 */
Renderer.prototype.convert2Dto1D = function(x, y, mapWidth) {
	if(this.chunksUsed == false)
		throw 'Width and height not know because no map JSON was loaded with drawMap()';
	return x + (y * mapWidth); // TODO: fix
};

/**
 * Internal helper function.
 * Basically determines if two arrays of primitive are equivalent.
 *
 * @param 	{array} 	a1 		Some arbitrary array of primitives (int, etc).
 * @param 	{array} 	a2 		Some arbitrary array of primitives (int, etc).
 * @return True if they equal, false if not.
 * @author jvillemare
 * @see Renderer.drawMap(...)
 */
Renderer.prototype.basicArrayEquals = function(a1, a2) {
	return JSON.stringify(a1) == JSON.stringify(a2);
};

/**
 * Draw a static map to the viewport at the top, left-most position.
 *
 * @param 	{int} 	mapID 	ID of map in the tile source.
 * @return {int} of tile ID of map.
 * @author jvillemare
 */
Renderer.prototype.drawStaticMap = function(mapID) {
	return this.draw(mapID, 0, 0);
};

/**
 * Draw map to viewport from map data.
 *
 * @param	{string} 		mapSource 	JSON containing map data.
 * @param 	{object}		mapSource 	Map data, already loaded.
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.drawMap = function(mapSource) {
	// load
	var map;
	if(typeof mapSource == 'string')
		fetch(mapSource).then(response => response.json()).then(data => map = data);
	else
		map = mapSource;
	// precondition check
	if(map == undefined)
		throw 'Failed to load mapSource of ' + mapSource + ' probably because it is a cross origin request.';
	// load useful data
	var mapWidth = map.layers[0].width, mapHeight = map.layers[0].height,
	tileWidth = map.tilewidth, tileHeight = map.tileheight;
	if(mapWidth < 0 || mapHeight < 0 || tileWidth < 0 || tileHeight < 0)
		throw 'Map or tile width or height cannot be less than 0';
	map = map.layers[0].data; // extract just map data
	this.map = map;
	this.mapDimensions.width = mapWidth;
	this.mapDimensions.height = mapHeight;
	console.log('mapwidth is ' + mapWidth + ' and mapheight is ' + mapHeight);

	// fill map
	this.chunksUsed = true;
	for(var i = 0; i < map.length; i++) {
		if(map[i] != 0) { // 0 means blank tile in map data.
			var newSprite = document.createElement('div');
			var newID = i;
			this.mapTiles += 1;
			var spriteID = 't' + map[i];
			newSprite.id = newID;
			newSprite.classList = spriteID; // game object class, see main.css
			var positions = this.convert1Dto2D(i, mapWidth);
			newSprite.setAttribute(
				'style',
				'top: ' + (positions[1] * tileWidth) + // [1] is y, [0] is x
				'px; left: ' + (positions[0] * tileHeight) + 'px;'
			);
			var chunkToAddTo = this.getChunkID(positions, mapWidth, 10);
			this.chunkDoesExist(chunkToAddTo);
			this.chunksNodes[chunkToAddTo].appendChild(newSprite);
		}
	};
	// test dimensions
	if(
		this.basicArrayEquals(
			this.convert1Dto2D(
				this.convert2Dto1D(mapWidth - 1, mapWidth - 1, mapWidth),
				mapWidth
			),
			[mapWidth - 1, mapWidth - 1]
		) == false) {
		throw 'convert1Dto2D of convert2Dto1D using x=2 and y=3 does NOT return an array containing [2, 3]. The math is off in one or both of those functions.';
	}
};

/**
 * Move an existing tile from its current position by a specified amount.
 *
 * @param 	{int} 	id	ID of tile given by drawAt() function.
 * @param 	{int}	x 	Delta horizontal (change in position.)
 * @param 	{int}	y 	Delta vertical (change in position.)
 * @return nothing.
 * @author jvillemare.
 */
Renderer.prototype.moveTile = function(id, x, y) {
	this.tiles[id].ref.setAttribute(
		'style',
		'top: ' + (this.tiles[id].y = y) + // update virtual positions and DOM
		'px; left: ' + (this.tiles[id].x = x) + 'px;'
	);
};

/**
 * Shift an existing tile from its current position by a specified amount.
 *
 * @param 	{int}	id 	ID of tile given by drawAt() function.
 * @param 	{int}	dx	Delta horizontal (change in position.)
 * @param 	{int}	dy	Delta vertical (change in position.)
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.shiftTile = function(id, dx, dy) {
	this.viewport.children[id].setAttribute(
		'style',
		'top: ' + (this.tiles[id].y += dy) + // update virtual positions and DOM
		'px; left: ' + (this.tiles[id].x += dx) + 'px;'
	);
};

/**
 * "Draw" a tile on screen. Note: Image must already be present as an img tag in
 * the #tiles div in index.html
 *
 * @param 	{int}	imageName 	ID name of image.
 * @param 	{int}	whereX 		Horizontal position to draw.
 * @param 	{int}	whereY 		Vertical position to draw.
 * @returns {int}	id of tile. Used in moveTile for faster performance.
 * @author jvillemare
 */
Renderer.prototype.draw = function(imageName, whereX, whereY) {
	if(this.tileSource.children[imageName] == undefined)
		throw 'Specified tile imageName="' + imageName + '" does not exist in the tile source of ' + this.tileSource.id;
	var newImage = document.createElement(this.tileSource.children[imageName].nodeName.toLowerCase());
	var newID = this.tiles.length + 1;
	newImage.id = newID;
	newImage.src = this.tileSource.children[imageName].src;
	newImage.width = this.tileSource.children[imageName].width;
	newImage.height = this.tileSource.children[imageName].height;
	newImage.classList = 'go ' + this.tileSource.children[imageName].classList; // game object class, see main.css
	newImage.setAttribute(
		'style',
		'top: ' + whereY + // update virtual positions and DOM
		'px; left: ' + whereX + 'px;'
	);
	this.viewport.appendChild(newImage);
	this.tiles[newID] = {
		ref: newImage,
		image: imageName,
		x: whereX,
		y: whereY
	};
	return newID;
};

// ================================== HELPERS ==================================

/**
 * Attached to window.onresize, automatically resizes the viewport to the full
 * screen width and height.
 * @return nothing.
 * @author jvillemare
 */
Renderer.prototype.resizeViewport = function() {
	renderer.viewport.setAttribute('style', 'width: ' + document.width + 'px; height: ' + document.height + 'px;');
};

/**
 * Checks to see if the requested tile at all visible in the current viewport.
 * Is used for hiding tiles that are no longer visible.
 * @returns 	{bool}	True if visible, false if not.
 * @author jvillemare
 */
Renderer.prototype.isTileInViewport = function(tile) {
	// ...
};

// ================================== GETTERS ==================================

/**
 * Getter.
 * @returns 	{dict}	All chunk organization info, organized in a dictionary.
 * @author jvillemare
 */
Renderer.prototype.getChunkInfo = function() {
	return {
		chunks: this.chunks, // IDs of chunks in array
		chunksNodes: this.chunksNodes, // references to chunk nodes
		chunksUsed: this.chunksUsed, // bool if chunks are used
		mapDimensions: this.mapDimensions, // two element array, dimensions
		mapTiles: this.mapTiles // number of map tiles "drawn"
	};
};

/**
 * Getter.
 * @returns 	{int}	Horizontal position of viewport, center of screen.
 * @author jvillemare
 */
Renderer.prototype.getX = function() { return this.settings.x; };

/**
 * Getter.
 * @returns 	{int}	Vertical position of viewport, center of screen.
 * @author jvillemare
 */
Renderer.prototype.getY = function() { return this.settings.y; };

/**
 * Getter.
 * @returns 	{int}	Zoom of viewport, center of screen.
 * @author jvillemare
 */
Renderer.prototype.getZoom = function() {
	return this.settings.zoom;
};

/**
 * Getter.
 * @returns 	{array}	All the tiles currently "rendered" in the viewport.
 * @author jvillemare
 */
Renderer.prototype.getTiles = function() {
	return this.tiles;
};
