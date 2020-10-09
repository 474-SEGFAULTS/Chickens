var Enemy=function(){
  this.enemy=[];
  this.defaultHealth=100;
  this.defaultspeed=1;
  this.active=null;
  this.num_player=0;
}

Enemy.prototype.init=function(image,x,y,hits){
  console.log(x,y);
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
  if(this.enemy[id].hits==0){
    $("#"+this.enemy[id].renderid+".enemy").remove();
    this.enemy.splice(id,1);
    player.kill(player.getActive());
  }
}
Enemy.prototype.shoot=function(id){
  
}
