ig.module( 
	'game.entities.player.player' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

	health: 4,
	maxHealth: 4,
	resistance: 5,	
	speed: {x: 5, y: 0},
	verticalAxisAlignment: 0,
	horizontalAxisAlignment: 0,		
	aim: null,
	enableMotion: true,
	motion: "regulateMotion",
	lifeMeter: null,
	h_centered: false,
	onAccelerate: false,
	currentShoot: 0,
	origin: {x: null, y: null},
	gravitationPoint: {x: null, y: null},
	gravitationPoints: {top : 40, middle : 110, bot : 200},

	init: function(x, y, settings) {
		ig.game.player = this;

		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

		this.gravitationPoint.x = ig.game.center.x;
		this.gravitationPoint.y = this.gravitationPoints.middle;

		this.lifeMeter = ig.game.spawnEntity(EntityLifemeter, this.pos.x, this.pos.y);

		this.animSheet = new ig.AnimationSheet('media/pictures/dragon.png', 32, 32);
		this.addAnim('idle', 0.1, [5, 6, 7, 8]);

		this.maxVel.x = 1000;		
		this.origin.x = x;
		this.origin.y = y;
		this.parent(x, y, settings);
	},

	/*abstract player speed by directly manipulating its coords on the map
	*axis alignments barely adjust player's position on vertical axis, creating
	*a waving motion
	*during boss phase initialization, the game will force the player to force
	*/
	update: function() {
		if(this.speed) {
			this.pos.x += this.speed.x;
			this.pos.y += this.speed.y;
		}

		if(ig.input.state('up') && this.gravitationPoint.y != this.gravitationPoints.top) this.gravitationPoint.y -= 2;
		if(ig.input.state('down') && this.gravitationPoint.y != this.gravitationPoints.bot) this.gravitationPoint.y += 2;

		this.calculateCurrentShoot();
		
		if(ig.game.boss) this.land();
		
		if(this.health > this.maxHealth) this.health--;

		if(this.motion && this.enableMotion) this[this.motion]();

		if(!this.enableMotion) {
			this.accel.y = 0;
			this.vel.y = 0;
		} 
			
		this.parent();
	},

	regulateMotion: function() {
		this.verticalAxisAlignment = (this.pos.y < this.gravitationPoint.y) ? 1 : -1;
		this.horizontalAxisAlignment = (this.pos.x < this.gravitationPoint.x) ? -1 : 1;
		this.accel.y = this.verticalAxisAlignment ? this.verticalAxisAlignment > 0 ? 500 : -500 : 0;
	},

	calculateCurrentShoot: function() {
		if(!this.aim) return;
		if(this.currentShoot == this.aim.wordLength) {
			this.aim = null;
			this.currentShoot = 0;
		}
	},

	/*once the player has reached the center of the screen (by testing the horizontal axis),
	*the screen focus on the player. once landed, the camera frees the player so he can restore
	*its initial position on the screen. once his position on X-axis is reseted on its origin position
	*the fight begins
	*/
	land: function() {
		this.h_centered = (this.pos.x >= ig.game.center.x) ? true : false;

		if(this.h_centered && this.onAccelerate) {		
			this.speed.y = (this.pos.y <= 480) ? this.speed.x/2 : 0;	
			this.onAccelerate = (this.pos.y >= 480) ? false : true;	 
			ig.game.scrollSpeed.x = this.speed.x;
			ig.game.scrollSpeed.y = this.speed.y;
		}

		if(!this.onAccelerate && this.pos.x >= (ig.game.backAxis + this.origin.x) && this.speed.x > 0)
			this.speed.x -= 0.2;

		if(!this.onAccelerate && this.pos.x <= (ig.game.backAxis + this.origin.x)) {
			ig.game.scrollSpeed.x = 0;
			ig.game.scrollSpeed.y = 0;			
			if(!ig.game.boss.isLanded) ig.game.boss.land();
		}
	},

	/*equilibrates player's global velocity by changing positives values to negative values
	* and vice-versa
	*/
	regulateGlobalVelocity: function() {
		this.accel.x = (this.accel.x > 0) ? -Math.abs(this.accel.x) : Math.abs(this.accel.x);
		this.accel.y = (this.accel.y > 0) ? -Math.abs(this.accel.y) : Math.abs(this.accel.y);		
	},

	/*is called from ennemy orb entity if the right letter has been typed*/
	shoot: function(entity) {
		this.currentShoot++;
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y, entity);
	}

});

});