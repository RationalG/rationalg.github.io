ig.module( 
	'game.entities.projectiles.fireball' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityFireball = ig.Entity.extend({

	size: {x: 23, y: 14},
	aim: null,
	//hitSound: new ig.Sound('media/sounds/hit.ogg'),
	//shootSound: new ig.Sound('media/sounds/shoot.ogg'),

	init: function(x, y, settings) {
		this.animSheet = new ig.AnimationSheet('media/pictures/fireball.png', 23, 14);
		this.addAnim('idle', 1, [0]);
		this.maxVel.x = 1000;
		this.speed = 800;

		//this.shootSound.volume = 0.2;
		//this.hitSound.volume = 0.2;
		//this.shootSound.play();

		this.aim = settings;
		this.parent(x, y);
	},

	update: function() {
		var angle = this.angleTo(this.aim);
		this.vel.x = Math.cos(angle) * this.speed;
		this.vel.y = Math.sin(angle) * this.speed;

		if(this.touches(this.aim)) {
			this.aim.frame.text[0] = this.aim.frame.text[0].substr(1);
			this.aim.receiveDamage(1, this);
			//this.hitSound.play();
			this.checkDeath(this.aim);
			this.kill();
		}
		
		this.parent();
	},

	checkDeath: function(aim) {
		if(typeof aim === 'undefined') return;
		
		if(aim._killed) {
			//ig.game.player.aim = null;
			ig.game.player.health++;
			ig.game.spawnEntity(EntityExplosion, this.pos.x + 61.2, this.pos.y - 61.2);
			ig.game.orbs = ig.game.orbs.slice(1);
			ig.game.measurePerformance(aim);
		}
	}
	
});

});