ig.module( 
	'game.entities.system.scripter' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityScripter = ig.Entity.extend({
	mono: true,
	timer: null,
	interval: null,
	event: null,
	meteorPos: {x: 0, y: 0},
	scrollImg: null,
	preparedEvent: null,
	flameCount: 0,
	
	init: function(x, y, settings) {
		this.scrollImg = {img: null, x: ig.system.width, y: ig.game.center.y};
		this.parent(x, y, settings);
	},

	update: function() {
		if(this.event) this[this.event]();
		this.parent();
	},

	elevate: function(callback) {
		console.log('event call');
		if(!this.timer) {
			this.timer = new ig.Timer();
			this.timer.set(0.5);
			this.mono = true;
		}

		if(this.timer.delta() < 0) {
			ig.game.player.speed.y = -5;
			ig.game.scrollSpeed.y = -5;
		}
		else {
			ig.game.player.speed.y = 0;
			ig.game.scrollSpeed.y = 0;
			this.event = null;
			this.timer = null;
		} 
	},

	lower: function(callback) {
		console.log('event call');
		if(!this.timer) {
			this.timer = new ig.Timer();
			this.timer.set(0.5);
			this.mono = true;
		}

		if(this.timer.delta() < 0) {
			ig.game.player.speed.y = 5;
			ig.game.scrollSpeed.y = 5;
		}
		else {
			ig.game.player.speed.y = 0;
			ig.game.scrollSpeed.y = 0;
			this.event = null;
			this.timer = null;
		} 
	},

	cloud: function(callback) {
		console.log('event call');
		if(!this.timer) {
			this.timer = new ig.Timer();
			this.timer.set(10);
			this.mono = false;
			this.scrollImg.img = new ig.Image('media/pictures/clouds.png');
		}

		if(this.timer.delta() < 0) {
			this.scrollImg.x -= 3;
			if(this.scrollImg.x <= 0 - this.scrollImg.img.width) this.scrollImg.x = ig.system.width;
		}
		else {
			this.event = null;
			this.timer = null;
			this.scrollImg = {img: null, x: ig.system.width, y: ig.game.center.y };
		}	
	},

	flamethrow: function() {
		if(!ig.game.frontAxis && !ig.game.center.y) return;

		this.mono = true;
		
		this.meteorPos.y = (!this.meteorPos.y) ? -Math.abs(ig.system.height/4) : this.meteorPos.y;
		
		if(!this.timer) {
			this.timer = new ig.Timer();
			this.timer.set(2);
		}

		if(this.timer.delta() < 0) {
			ig.game.spawnEntity(EntityMeteorite, ig.game.frontAxis, ig.game.center.y + this.meteorPos.y - 30);
			ig.game.screenShaker.timedShake(50, 0.5);
		}
		else {		
			if(!this.interval) {
				if(this.flameCount == 3) {
					this.event = null;
					this.timer = null;
				}
				this.interval = new ig.Timer();
				this.interval.set(2);
				console.log("interval");
				this.flameCount++;
			}

			if(this.interval.delta() > 0) {
				this.meteorPos.y = ((ig.game.center.y + this.meteorPos.y) < ig.system.height/2) ? Math.abs(this.meteorPos.y) : -Math.abs(this.meteorPos.y);
				this.interval = null;
				this.timer.set(2);
			}

		}

	},

	draw: function() {
		this.parent();
		if(this.scrollImg.img) this.scrollImg.img.draw(this.scrollImg.x, 0);
	}
	
});

});