ig.module( 
	'game.entities.projectiles.meteorite' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMeteorite = ig.Entity.extend({

	animFrames: [0, 1, 2, 3, 4, 5],
	speed: 3,

	init: function(x, y, settings) {
		this.animSheet = new ig.AnimationSheet('media/pictures/meteorites.png', 96, 96);
		this.addAnim('idle', 0.05, this.animFrames, false);	
		this.parent(x, y, settings);
	},

	update: function() {
		this.pos.x -= this.speed;	
		this.parent();
	}
	
});

});