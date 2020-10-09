/**
 * game.js
 * Holds game state and game logic.
 */

var renderer = null,
    player = null,
    enemy = null;
var control = {
    "w": false,
    "a": false,
    "s": false,
    "d": false
};
var weapons = [];
var enemy_spawn = [
    [11, 9],
    [44, 6],
    [10, 22],
    [33, 16],
    [63, 23],
    [47, 29],
    [4, 42],
    [74, 42]
];
var delay = 1000;
var lastClick = 0;
var loop;
var going = true;

// Author: Jiamian
// handle all the key press
document.addEventListener('keydown', function(event) {
    control[event.key.toLowerCase()] = true;
    if (event.key.toLowerCase() == 'w' | event.key == 'ArrowUp') {
        player.setJump(player.getActive(), true);
    } else if (event.key.toLowerCase() == 's' | event.key == 'ArrowDown') {
        console.log('down');
    } else if (event.key.toLowerCase() == 'a' | event.key == 'ArrowLeft' | event.key.toLowerCase() == 'd' | event.key == 'ArrowRight') {
        if (going) {
            playSound('WalkExpand', true);
        }
    } else if (event.key.toLowerCase() == 'e') {
        player.switch(player.getActive());
    } else if (event.key == "Escape") {
        document.getElementById("myForm").style.display = "block";
        going = false;
    } else if (event.key == " ") {
        event.preventDefault();
        if (lastClick < (Date.now() - delay)) {
            player.shoot(player.getActive());
            lastClick = Date.now();
        }

    }
});

document.addEventListener('keyup', function(event) {
    control[event.key.toLowerCase()] = false;
    if (event.key.toLowerCase() == 'a' | event.key == 'ArrowUp' |
        event.key.toLowerCase() == 'd' | event.key == 'ArrowRight') {
        stopSound('WalkExpand');
    }
});

// used to track how many enemy defeated
// setScore(300);
function setScore(count) {
    document.getElementById('score').innerHTML = count;
}

function closePop() {
    document.getElementById("myForm").style.display = "none";
    loop = window.requestAnimationFrame(update);
    going = true;
}

function openHappy() {
    document.getElementById("myForm").style.display = "none";
}

// Author: Happy
// jquery start new singleGameScene/instructionScene
$(document).ready(function() {
    addSounds();
    // render

    // menu buttons
    $("#single-player-btn").click(function() {
        renderer = new Renderer('background-layer', 'tiles');
        renderer.drawMap(level1);
        player = new Player();
        enemy = new Enemy();
        player.init('player', true, "test", 50, 50, 100, 1, "right");
        loop = window.requestAnimationFrame(update);
        spawn_enemy()
        for (var i = 0; i < enemy_spawn.length; i++) {
            //enemy.init("lion",enemy_spawn[i][0]*8,enemy_spawn[i][1]*8-22);
            //enemy.init("dragon",enemy_spawn[i][0]*8,enemy_spawn[i][1]*8-22);
        }
        $('#game').show();
        $('#menu-screen').fadeOut('fast', function() {
            $('#singlePlayer').fadeIn('fast');
        });
    });
    $("#instructions-btn").click(function() {
        $('#menu-screen').fadeOut('fast', function() {
            $('#instructions').fadeIn('fast');
        });
    });
    $("#main-menu-btn").click(function() {
        $('#instructions').fadeOut('fast', function() {
            $('#menu-screen').fadeIn('fast');
        });
    });
    $("#restartbtn").click(function() {
        $('#happyEnding').fadeOut('fast', function() {
            $('#menu-screen').fadeIn('fast');
            $('#menu-screen').hide();
        });
    });
    $("#restartbtn2").click(function() {
        $('#badEnding').fadeOut('fast', function() {
            $('#menu-screen').fadeIn('fast');
        });
    });
    $("#cancelbtn").click(function() {
        window.cancelAnimationFrame(loop);
        renderer.clear();
        setScore(player.getKill(player.getActive()));
        openHappy();
        $('#singlePlayer').fadeOut('fast');
        $('#happyEnding').fadeIn('fast');
    });
});

function chickenDead() {
    console.log("tset");
    $('#single-player').fadeOut('fast', function() {
        $('#badEnding').fadeIn('fast');
        $('#menu-screen').hide();
    });
    renderer.clear();
    window.cancelAnimationFrame(loop);
}

function spawn_enemy() {
    var temp = Array.from(enemy_spawn);
    for (var i = 0; i < Math.min(Math.pow(2, player.stage), 8); i++) {
        var rand = Math.floor(Math.random() * Math.floor(temp.length));
        var x = temp[rand][0] * 8;
        var y = temp[rand][1] * 8 - 22;
        temp.splice(rand, 1);
        if (Math.floor(Math.random() * Math.floor(2)) == 0) {
            enemy.init("dragon", x, y, 2);
        } else {
            enemy.init("lion", x, y, 2);
        }

    }
}

/**
 * Determines if two circles intersect.
 *
 * @param {*} x1 coordinate x of first circle
 * @param {*} y1 coordinate y of first circle
 * @param {*} radius1 radius of first circle
 * @param {*} x2 coordinate x of second circle
 * @param {*} y2 coordinate y of second circle
 * @param {*} radius2 radius of second circle
 * @return true if they intersect, false if they do not
 */
function twoCircleIntersect(x1, y1, radius1, x2, y2, radius2) {
    var distSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    var radiusSumSq = Math.pow(radius1 + radius2, 2);

    return (distSq > radiusSumSq);

};

/**
 * Detrmines if a line intersects a circle.
 *
 * @param {*} x1 line point x
 * @param {*} y1 line point y
 * @param {*} angle1 angle of line
 * @param {*} length length of line (how far can weapon shoot)
 * @param {*} x2 x coordinate of circle
 * @param {*} y2 y coordinate of circle
 * @param {*} radius2 radius of circle (to be given as a double)
 * @return returns true if line intersects, and false if it does not
 *
 * Using a vector and inspired by https://stackoverflow.com/q/1073336/13158722
 */
function lineIntersectCircle(x1, y1, angle1, length, x2, y2, radius2) {
    // find the end point of the line
    var lineEndX = (round(x1 + Math.cos(angle1 * 3.14 / 180.0) * length));
    var lineEndY = (round(y1 + Math.sin(angle1 * 3.15 / 180.0) * length));

    // compute the AB segment length
    var LAB = sqrt(Math.pow(lineEndX - x1, 2) + Math.pow(lineEndY - y1, 2));

    // compute the direction vector D from A to B
    var Dx = ((lineEndX - x1) / LAB);
    var Dy = ((lineEndY - y1) / LAB);

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
