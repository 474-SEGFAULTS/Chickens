/**
 * game.js
 * Holds game state and game logic.
 */

// ..
var players=[];
var healthMax=100;
var num_player=0;
var renderer;
var activeplayer;
function playerinit(image,active,name,x,y,health,speed,facing){
    var renderid = renderer.draw(image, x, y);
    if(activeplayer==null&&active){
        activeplayer=num_player;
    };
    players.push({
        active: active,
        name: name,
        x: x,
        y: y,
        health: health,
        speed: speed,
        renderid: renderid,
        facing: facing,
        onGround: false
    });
    
    return players.length-1
}

function getPlayerRenderID(id){
    return players[id]["renderid"]
}

function getPlayerSpeed(id){
    return players[id]['speed'];
}

function setPlayerSpeed(id,speed){
    players[id]['speed']=speed;
}

function setPlayerHealth(id,health){
    players[id]['health']=health;
}

function shiftPlayerSpeed(id,shift){
    players[id]['speed']+=shift;
}

/**
 * Shift the health for a player from the current health.
 *
 * @param 	id 	ID of player given by playerinit() function.
 * @param 	shift	change in health.
 */
function shiftPlayerHealth(id,shift){
    players[id]['health']+=shift;
    if(players[id]['health']>100){
        players[id]['health']=100;
    }
}

// Author: Jiamian
// handle all the key press

document.addEventListener('keydown', function(event){
    if(event.key.toLowerCase()=='w' | event.key=='ArrowUp'){
        console.log('up');
        move('up');
    }
    else if(event.key.toLowerCase()=='s' | event.key=='ArrowDown'){
        console.log('down');
        move('down');
    }
    else if(event.key.toLowerCase()=='a' | event.key=='ArrowLeft'){
        move('left');
        playSound('WalkExpand',true);
    }
    else if(event.key.toLowerCase()=='d' | event.key=='ArrowRight'){
        move('right');
        playSound('WalkExpand',true);
    }
    else if(event.key.toLowerCase()=='e'){
        alert('open inventory');
    }
    else if(event.key=="Esacpe"){
        alert('pause');
    }
});
document.addEventListener('keyup', function(event){
    if(event.key.toLowerCase()=='a' | event.key=='ArrowUp'|
    event.key.toLowerCase()=='d' | event.key=='ArrowRight'){
        stopSound('WalkExpand');
    }
});
// Author: Jiamian
// move the Chickens
function move(direction){
    if(renderer!=null){
        var speed=getPlayerSpeed(activeplayer);
        var renderid=getPlayerRenderID(activeplayer)
        if(direction=="right"){
            renderer.shiftTile(renderid,speed,0);
        }
        else if(direction=="left"){
            renderer.shiftTile(renderid,-speed,0);
        }
        else if(direction=="up"){
            players[activeplayer]["onGround"]=false;
            
        }
    }
}

// Author: Happy
// jquery start new singleGameScene/instructionScene
$(document).ready(function () {
    addSounds();
    $("#singlePlayerbtn").click(function () {
        $('#menuScreen').fadeOut('fast', function () {
            $('#singlePlayer').fadeIn('fast');
            renderer = new Renderer('singlePlayer', 'tiles');
            playerinit('lion',true,"test",50,50,100,1,"right");
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