ig.module( 
	'game.entities.projectiles.explosion' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityExplosion = ig.Entity.extend({

	animFrames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	//sound: new ig.Sound('media/sounds/explosion.ogg'),

	//this entity just spawn as soon as an ennemy got killed
	init: function(x, y, settings) {
		this.animSheet = new ig.AnimationSheet('media/pictures/boom.png', 57, 63);
		this.addAnim('idle', 0.05, this.animFrames , true);	
		//this.sound.volume = 0.2;
		//this.sound.play();
		this.parent(x, y, settings);
	},

	update: function() {	
		this.parent();
	}
	
});

});