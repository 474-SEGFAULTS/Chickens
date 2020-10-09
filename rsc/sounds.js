/**
 * sounds.js
 * Felper functions for using the sounds
 */

// ...
//Add cursor select sound on all button
var sounds=["CursorSelect","explosion1","WalkExpand","shoot","psss"];
$(document).ready(function (){
  $('button').click(function(){
    playSound("CursorSelect");
  });
});
//TODO
//Attach all the sounds to the html page when loading
function addSounds() {
  for(var i=0;i<sounds.length;i++){
    let newSrc=document.createElement("audio");
    newSrc.setAttribute('src','rsc/sounds/'+sounds[i]+'.wav');
    newSrc.setAttribute('id',sounds[i]);
    $('body').append(newSrc);
  }
};

//Play sound by finding it's if
function playSound(soundid,loop){
  if(loop){
    document.getElementById(soundid).loop = true;
  }
  document.getElementById(soundid).play();
}

function stopSound(soundid){
  let audio=document.getElementById(soundid);
  audio.pause();
  audio.currentTime=0;
}