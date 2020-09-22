/**
 * game.js
 * Holds game state and game logic.
 */

// ..




// Author: Happy
// jquery start new singleGameScene/multiGameScene
$(document).ready(function () {
    $('#singlePlayer').hide();
    $('#multiPlayer').hide();
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