var Player = function() {
	this.players = [];
	this.defaultHealth = 100;
	this.defaultspeed = 1;
	this.active = null;
	this.num_player = 0;
	this.stage = 1;
	this.weapons = ["bell_pepper", "chiltepin", "bubble", "thai_pepper", "garlic"];
}

Player.prototype.init = function(image, active, name, x, y, health, speed, facing) {
	var renderid = renderer.draw(image, x, y);
	var health1 = renderer.draw("health", x - 2, y);
	var health2 = renderer.draw("healthgreen", x - 2, y);
	if (this.active == null && active) {
		this.active = this.num_player;
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
		jumping: false,
		healthbar: [health1, health2],
		killcount: 0,
		weapon: 0
	});

	return this.players.length - 1;
}
Player.prototype.getPlayer = function(id) {
	return this.players[id];
}
Player.prototype.getRenderID = function(id) {
	return this.players[id].renderid;
}
Player.prototype.getSpeed = function(id) {
	return this.players[id].speed;
}
Player.prototype.setSpeed = function(id, speed) {
	this.players[id].speed = speed;
}
Player.prototype.shiftSpeed = function(id, speed) {
	this.players[id].speed += speed;
}
Player.prototype.getHealth = function(id) {
	return this.players[id].health;
}
Player.prototype.setHealth = function(id, health) {
	this.players[id].health = health;
}
Player.prototype.shiftHealth = function(id, health) {
	this.players[id].health += health;
	if (this.players[id].health > this.defaultHealth) {
		this.players[id].health = this.defaultHealth;
	}
}
Player.prototype.getX = function(id) {
	return this.players[id].x;
}
Player.prototype.setX = function(id, x) {
	this.players[id].x = x;
}
Player.prototype.shiftX = function(id, x) {
	this.players[id].x += x;
	if (this.players[id].x < 0) {
		this.players[id].x = 0;
	}
}
Player.prototype.getY = function(id) {
	return this.players[id].y;
}
Player.prototype.setY = function(id, y) {
	this.players[id].y = y;
}
Player.prototype.shiftY = function(id, y) {
	this.players[id].y += y;
	if (this.players[id].y < 0) {
		this.players[id].y = 0;
	}
}
const offsetViewport = window.innerHeight / 3;
Player.prototype.move = function(id) {
	renderer.moveTile(this.getRenderID(id), this.getX(id), this.getY(id));
	renderer.moveViewport(this.getX(id), this.getY(id) - offsetViewport, 50);
	renderer.moveTile(this.getHealthbar(id, 0), this.getX(id) - 2, this.getY(id));
	renderer.moveTile(this.getHealthbar(id, 1), this.getX(id) - 2, this.getY(id));
}
Player.prototype.getActive = function() {
	return this.active;
}
Player.prototype.getJump = function(id) {
	return this.players[id].jumping;
}
Player.prototype.setJump = function(id, jump) {
	this.players[id].jumping = jump;
}
Player.prototype.getFacing = function(id) {
	return this.players[id].facing;
}
Player.prototype.setFacing = function(id, facing) {
	this.players[id].facing = facing;
}
Player.prototype.getHealthbar = function(id, index) {
	return this.players[id].healthbar[index];
}
Player.prototype.kill = function(id) {
	this.players[id].killcount += 1;
}
Player.prototype.getKill = function(id) {
	return this.players[id].killcount;
}
Player.prototype.switch = function(id) {
	this.players[id].weapon = (this.players[id].weapon + 1) % this.weapons.length;
}
Player.prototype.shoot = function(id) {
	var bullet;
	var weapon = this.weapons[this.players[id].weapon]
	var time = 1000;

	if (this.getFacing(id) == "right") {
		bullet = renderer.draw(weapon, player.getX(id), player.getY(id));
		$("#" + bullet + "." + weapon).addClass(weapon + "_animation_right");
	} else {
		bullet = renderer.draw(weapon, player.getX(id) - 30, player.getY(id));
		$("#" + bullet + "." + weapon).addClass(weapon + "_animation_left");
	}
	var enemies = enemy.getEnemy();
	for (var i = 0; i < enemies.length; i++) {
		if (weapon == "garlic") {
			playSound("explosion1");
			time = 2000;
			if (Math.abs(enemies[i].y - player.getY(id)) < 16 && Math.abs(enemies[i].x - player.getX(id)) < 400) {
				if ((enemies[i].x < player.getX(id) && this.getFacing(id) == "left") || (enemies[i].x > player.getX(id) && this.getFacing(id) == "right")) {
					time = Math.abs(enemies[i].x - player.getX(id)) * 10;
					enemy.hit(i, 2);
				}
			}
		} else {
			playSound("psss");
			if (Math.abs(enemies[i].y - player.getY(id)) < 16 && Math.abs(enemies[i].x - player.getX(id)) < 200) {
				if ((enemies[i].x < player.getX(id) && this.getFacing(id) == "left") || (enemies[i].x > player.getX(id) && this.getFacing(id) == "right")) {
					time = Math.abs(enemies[i].x - player.getX(id)) * 5;
					enemy.hit(i, 1);
				}
			}
		}
	}
	setTimeout(
		function() {
			$("#" + bullet + "." + weapon).remove();
		}, time);
	if (enemy.getEnemy().length == 0) {
		this.stage += 1;
		spawn_enemy()
	}
}

function update() {
	var rand = Math.floor(Math.random() * Math.floor(200 / player.stage));
	if (rand == 1) {
		var randenemy = Math.floor(Math.random() * Math.floor(enemy.getEnemy().length));
		enemy.shoot(randenemy);
	}
	var active = player.getActive();
	var x = (control.d - control.a) * player.getSpeed(active);
	var y = 0;
	var move = ["y-flappingLeft", "y-walkingLeft", "y-idleLeft", "y-flappingRight", "y-walkingRight", "y-idleRight"];
	var renderid = player.getRenderID(active);
	$("#" + renderid + ".player").removeClass(move);
	if (x > 0) {
		//$("#" + renderid + ".player").removeClass(left);
		player.setFacing(active, "right");
		//$("#" + renderid + ".player").removeClass(right);
		if (player.getJump(active)) {
			$("#" + renderid + ".player").addClass("y-flappingRight");
		} else {
			$("#" + renderid + ".player").addClass("y-walkingRight");
		}
	} else if (x < 0) {
		player.setFacing(active, "left");
		if (player.getJump(active)) {
			$("#" + renderid + ".player").addClass("y-flappingLeft");
		} else {
			$("#" + renderid + ".player").addClass("y-walkingLeft");
		}
	} else {
		if (player.getFacing(active) == "right") {
			$("#" + renderid + ".player").addClass("y-idleRight");
		} else {
			$("#" + renderid + ".player").addClass("y-idleLeft");
		}
	}

	if (!renderer.isGroundBeneath(Math.floor((player.getX(0) + 15) / 8), Math.floor((player.getY(0) + 30) / 8), 1)) {
		player.setJump(active, true);
		player.setY(active, player.getY(0));
		y += 2;
	} else {
		player.setJump(active, false);
	}
	if (control.w && !player.getJump(active)) {
		player.setJump(active, true);
		y -= 60;
	}
	if (player.getX(active) > 600) {
		player.setX(active, 600);
		x = 0;
	}
	if (player.getX(active) < 16) {
		player.setX(active, 16);
		x = 0;
	}
	var health = player.getHealth(active) * 30 / 100;
	if (player.getHealth(active) <= 0) {
		chickenDead();
	}
	player.shiftX(active, x);
	player.shiftY(active, y);
	player.move(active);
	$("#" + player.getHealthbar(active, 1) + ".healthgreen").css("width", health + "px");
	if (going) {
		window.requestAnimationFrame(update);
	}
}
