/**
 * sounds.js
 * Felper functions for using the sounds
 */

// ...
//Add cursor select sound on all button
$(document).ready(function (){
  $('button').click(function(){
    playSound("CursorSelect");
  });
});
//TODO
//Attach all the sounds to the html page when loading
function addSounds() {
  let newSrc=document.createElement("source");
  newSrc.setAttribute('src','rsc/sounds/CursorSelect.wav');
  newSrc.setAttribute('id','CursorSelect');
  document.getElementById('sounds').appendChild(newSrc);
};

//Play sound by finding it's if
function playSound(soundid){
  document.getElementById(soundid).play();
}