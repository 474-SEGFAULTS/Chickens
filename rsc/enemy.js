var Enemy=function(){
  this.enemy=[];
  this.defaultHealth=100;
  this.defaultspeed=1;
  this.active=null;
  this.num_player=0;
}

Enemy.prototype.init=function(image,x,y,hits){
  var renderid = renderer.draw(image, x, y);
  this.enemy.push({
    x:x,
    y:y,
    hits:hits,
    renderid:renderid
  });
}
Enemy.prototype.getEnemy=function(){
  return this.enemy;
}
Enemy.prototype.hit=function(id,count){
  this.enemy[id].hits-=count;
  if(this.enemy[id].hits<=0){
    $("#"+this.enemy[id].renderid+".enemy").attr("src","rsc/img/dynamic/characters/blank.png");
    $("#"+this.enemy[id].renderid+".enemy").addClass("poof-smoke").delay(1000).queue(function(){
      $(this).remove();
    });
    
    this.enemy.splice(id,1);
    player.kill(player.getActive());
  }
}
Enemy.prototype.shoot=function(id){
  playSound("shoot");
  var bullet;
  var directions=["left","right"];
  var rand=Math.floor(Math.random() * Math.floor(2));
  var dir=directions[rand];
  var enemy=this.enemy[id];
  var time=1000;
  var hen=player.getPlayer(player.getActive());
  bullet=renderer.draw("enemy_weapon",enemy.x,enemy.y);
  $("#"+bullet+".enemy_weapon").addClass("enemy_weapon_"+dir);
  if(Math.abs(enemy.y-hen.y)<5&&Math.abs(enemy.x-hen.x)<200){
    if((enemy.x<hen.x&&dir=="right")||(enemy.x>hen.x&&dir=="left")){
      time=Math.abs(enemy.x-hen.x)*5;
      player.shiftHealth(player.getActive(),-25);
    }
  }
  setTimeout(
    function(){
      $("#"+bullet+".enemy_weapon").remove();
    },time);
}
