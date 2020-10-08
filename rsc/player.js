var Player=function(){
  this.players=[];
  this.defaultHealth=100;
  this.defaultspeed=1;
  this.active=null;
  this.num_player=0;
}

Player.prototype.init=function(image,active,name,x,y,health,speed,facing){
  var renderid = renderer.draw(image, x, y);
  if(this.active==null&&active){
    this.active=this.num_player;
  }
  this.players.push({
      active: active,
      name: name,
      x: x,
      y: y,
      health: health,
      speed: speed,
      renderid: renderid,
      facing: facing,
      jumping: false
  });
  
  return this.players.length-1
}

Player.prototype.getRenderID=function(id){
  return this.players[id].renderid;
}
Player.prototype.getSpeed=function(id){
  return this.players[id].speed;
}
Player.prototype.setSpeed=function(id,speed){
  this.players[id].speed=speed;
}
Player.prototype.shiftSpeed=function(id,speed){
  this.players[id].speed+=speed;
}
Player.prototype.getHealth=function(id){
  return this.players[id].health;
}
Player.prototype.setHealth=function(id,health){
  this.players[id].health=health;
}
Player.prototype.shiftHealth=function(id,health){
  this.players[id].health+=health;
  if(this.players[id].health>this.defaultHealth){
    this.players[id].health=this.defaultHealth;
  }
}
Player.prototype.getX=function(id){
  return this.players[id].x;
}
Player.prototype.setX=function(id,x){
  this.players[id].x=x;
}
Player.prototype.shiftX=function(id,x){
  this.players[id].x+=x;
}
Player.prototype.getY=function(id){
  return this.players[id].y;
}
Player.prototype.setY=function(id,y){
  this.players[id].y=y;
}
Player.prototype.shiftY=function(id,y){
  this.players[id].y+=y;
}
Player.prototype.move=function(id){
  renderer.moveTile(this.getRenderID(id),this.getX(id),this.getY(id));
}
Player.prototype.getActive=function(){
  return this.active;
}
Player.prototype.getJump=function(id){
  return this.players[id].jumping;
}
Player.prototype.setJump=function(id,jump){
  this.players[id].jumping=jump;
}
function update(){
  var active=player.getActive();
  var x = (control.d - control.a) * player.getSpeed(active);
  var y = 0;
  if (control.w && !player.getJump(active)) {
    player.setJump(active,true);
    y -= 40;
  }
  if (player.getJump(active)) {
    y += 2;
  }
  if (player.getY(active) > 60) {
    player.setJump(active,false);
    player.setY(active,60);
    y = 0;
  }
  player.shiftX(active, x);
  player.shiftY(active, y);
  player.move(active);
  window.requestAnimationFrame(update);
}