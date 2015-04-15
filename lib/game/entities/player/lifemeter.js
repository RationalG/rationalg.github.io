ig.module( 
	'game.entities.player.lifemeter' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLifemeter = ig.Entity.extend({

	/*add each frame corresponding to the player's life state*/
	init: function(x, y, settings) {
		this.animSheet = new ig.AnimationSheet('media/pictures/lifemeter.png', 34.75, 35);
		this.addAnim('full', 0.05, [0, 1, 2, 3]);
		this.addAnim('three', 0.05, [4, 5, 6, 7]);
		this.addAnim('two', 0.05, [8, 9, 10, 11]);
		this.addAnim('one', 0.05, [12, 13, 14, 15]);
		this.parent(x, y, settings);
	},

	/*the lifemeter informs the player about his life points
	*once case empties if health is decreasing by 1
	*its always following the player position
	*/
	update: function() {
		this.pos.x = ig.game.player.pos.x - 34;
		this.pos.y = ig.game.player.pos.y - 34;

		switch(ig.game.player.health) {
			case 4 : this.currentAnim = this.anims.full;  break;
			case 3 : this.currentAnim = this.anims.three; break;
			case 2 : this.currentAnim = this.anims.two;   break;
			case 1 : this.currentAnim = this.anims.one;	  break;
		}

		this.parent();
	},

	/*player shield must be at zero to receive one 'real' damage point
	*when occuring, the lifemeter see one of its cases become empty
	*/
	evaluate: function() {
		if(ig.game.player._killed) this.kill();

		if(!ig.game.player.resistance) {
			ig.game.player.receiveDamage(1, null);
			ig.game.player.resistance = 5;
		}
		else {
			ig.game.player.resistance--;
		}
	}
	
});

});