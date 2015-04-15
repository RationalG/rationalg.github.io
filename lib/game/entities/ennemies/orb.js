ig.module( 
	'game.entities.ennemies.orb' 
)
.requires(
	'impact.entity',
	'impact.input',
	'game.entities.ennemies.ennemy'
)
.defines(function() {
	
EntityOrb = EntityEnnemy.extend({

	//collision box size
	size: {x: 24, y: 24},

	/*the waveUpdate method located in the main class passes all the parameters
	*related to the ennemies through this init method
	*parameters concerned are name, timer
	*/
	init: function(x, y, settings) {
		/*Anim/sprite settings*/
		this.animSheet = new ig.AnimationSheet(settings.skin, 24, 24);
		this.addAnim('idle', 1, [0]);

		/*entity settings*/
		this.name = settings.name;
		this.shootDirection = settings.shootDirection;

		/*dont exceed this speed or the entity will go offscreen again*/
		this.maxVel.x = 300;			
		this.parent(x, y, settings);
	},

	/*visualState is managed by the overrided method located inside the mother class
	*the orb entity just brake its acceleration once on screen
	*/
	update: function() {
		if(this.visualState == 'onScreen') {
			if(this.vel.x == this.maxVel.x) {
				this.maxVel.x = 0;
				this.friction.x = 1000;
				this.pos.x += ig.game.scrollSpeed.x;
			}
			else {
				this.accel.x = 500;
			}
		}

		this.pos.y += ig.game.scrollSpeed.y;
		this.parent();
	},

	//show the ennemy label to type (on screen)
	draw: function() {
		this.parent();
	}

});

});