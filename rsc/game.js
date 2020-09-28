/**
 * game.js
 * Holds game state and game logic.
 */

// ..

// Author: Jiamian
// handle all the key press

document.addEventListener('keydown', function(event){
    if(event.key=='w' | event.key=='ArrowUp'){
        alert('up');
        move('up');
    }
    else if(event.key=='s' | event.key=='ArrowDown'){
        alert('down');
        move('down');
    }
    else if(event.key=='a' | event.key=='ArrowLeft'){
        move('left');
        alert('left');
    }
    else if(event.key=='d' | event.key=='ArrowRight'){
        alert('right');
        move('right');
    }
    else if(event.key=='e'){
        alert('open inventory');
    }
});
// Author: Jiamian
// move the Chickens
function move(direction){
    //TODO
}

// Author: Happy
// jquery start new singleGameScene/multiGameScene
$(document).ready(function () {
    $("#singlePlayerbtn").click(function () {
        $('#menuScreen').fadeOut('fast', function () {
            $('#singlePlayer').fadeIn('fast');
        });
    });
    $("#multiPlayerbtn").click(function () {
        $('#menuScreen').fadeOut('fast', function () {
            $('#multiPlayer').fadeIn('fast');
        });  
    });
});

