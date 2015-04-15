ig.module(
	'game.entities.projectiles.lightball'
)
.requires(
	'impact.entity',
	'impact.input'
)
.defines(function() {

EntityLightball = ig.Entity.extend({

	speed: 0,
	source: null,
	size: {x: 13, y: 13},
	//shootSound: new ig.Sound('media/sounds/laser.ogg'),

	init: function(x, y, settings) {
		this.animSheet = new ig.AnimationSheet('media/pictures/lightball.png', 13, 13);
		this.addAnim('idle', 1, [0]);
		this.maxVel.x = 1000;
		this.maxVel.y = 1000;
		this.speed = 1000;
		this.source = settings;
		//this.shootSound.volume = 0.1;
		//this.shootSound.play();
		this.parent(x, y);
	},

	update: function() {
		this.regulateDirection();

		if(this.touches(ig.game.player)) {
			ig.game.player.lifeMeter.evaluate();
			this.kill();
		}

		this.parent();
	},

	regulateDirection: function() {
		if(!this.source) return;
			
		switch(this.source.shootDirection) {
			case 'horizontalLeft' : this.vel.x -= this.speed; break;
			case 'horizontalRight' : this.vel.x += this.speed; break;
			case 'verticalDown' : this.vel.y += this.speed; break;
			case 'verticalUp' : this.vel.y -= this.speed; break;

		}		
	}

});

});