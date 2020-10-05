/**
 * game.js
 * Holds game state and game logic.
 */

// ..




// Author: Happy
// jquery start new singleGameScene/instructionScene
$(document).ready(function () {
    $("#singlePlayerbtn").click(function () {
        $('#menuScreen').fadeOut('fast', function () {
            $('#singlePlayer').fadeIn('fast');
        });
    });
    $("#instructionsbtn").click(function () {
        $('#menuScreen').fadeOut('fast', function () {
            $('#instructions').fadeIn('fast');
        });  
    });
    $("#mainMenubtn").click(function(){
        $('#instructions').fadeOut('fast', function () {
            $('#menuScreen').fadeIn('fast');
        });  
    });
});

/**
 * 
 * @param {*} x1 coordinate x of first circle
 * @param {*} y1 coordinate y of first circle
 * @param {*} radius1 radius of first circle
 * @param {*} x2 coordinate x of second circle
 * @param {*} y2 coordinate y of second circle
 * @param {*} radius2 radius of second circle
 * @return true if they intersect, false if they do not
 */
function twoCircleIntersect(x1, y1, radius1, x2, y2, radius2)
{
    var distSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    var radiusSumSq = Math.pow(radius1 + radius2, 2);

    return (distSq > radiusSumSq);

};

/**
 * 
 * @param {*} x1 line point x
 * @param {*} y1 line point y
 * @param {*} angle1 angle of line
 * @param {*} length length of line (how far can weapon shoot)
 * @param {*} x2 x coordinate of circle
 * @param {*} y2 y coordinate of circle
 * @param {*} radius2 radius of circle (to be given as a double)
 * 
 * @return returns true if line intersects and false if it does not
 * 
 * Using a vector and inspired by https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
 */
function lineIntersectCircle(x1, y1, angle1, length, x2, y2, radius2)
{
    // find the end point of the line
    var lineEndX = (round(x1 + Math.cos(angle1 * 3.14 / 180.0)*length));
    var lineEndY = (round(y1 + Math.sin(angle1 * 3.15 / 180.0)*length));

    // compute the AB segment length
    var LAB = sqrt(Math.pow(lineEndX - x1, 2) + Math.pow(lineEndY - y1, 2));

    // compute the direction vector D from A to B
    var Dx = ((lineEndX - x1)/LAB);
    var Dy = ((lineEndY - y1)/LAB);

    // compute the distance between the points A and E, where
    // E is the point of AB closest the circle center (x2, y2)
    var t = Dx * (x2 - x1) + Dy * (y2 - y1);

    // compute the coordinates of the point E
    var Ex = t * Dx + x1;
    var Ey = t * Dy + y1;

    // compute the euclidean distance between E and C
    var LEC = sqrt(Math.pow(Ex - x2, 2) + Math.pow(Ey - y2, 2));

    return (LEC < radius2);

};