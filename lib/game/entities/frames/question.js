ig.module( 
  'game.entities.frames.question' 
)
.requires(
  'impact.entity',
  'game.entities.frames.frame'
)
.defines(function() {

EntityQuestion = EntityFrame.extend({

	answers: [],
	displayed: false,
	placementTimer: new ig.Timer(),

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.initAnswers(settings.question);
	},

	update: function() {
		this.pos.x = this.carrier.pos.x + (this.carrier.size.x/4);
		this.pos.y = this.carrier.pos.y - (this.carrier.size.y/4);
		
		if(!this.displayed && this.placementTimer.delta() >= 0) this.displayAnswers();
		if(this.displayed) this.activateMotion();

		this.parent();
	},

	draw: function() {
		this.parent();
	},

	initAnswers: function(question) {
		var keys = ig.game.getPropertyName(question);
		
		for(var i = 1; i < keys.length -1; i++) {
			var newAnswer = ig.game.spawnEntity(EntityFrame, 0, 0, {
				carrier: this,
				pos: {x: 0, y: 0},
				text: [question[keys[i]]],
				zIndex: -10,
				hasStarted: false,
				hasBrake: false
			});
			this.answers.push(newAnswer);
		}
		ig.game.sortEntitiesDeferred();
		this.placementTimer.set(2);
	},

	displayAnswers: function() {	
		var xHolder = this.carrier.pos.x;
		var yHolder = this.carrier.pos.y + (this.carrier.size.y/2);
		for(var i = 0; i < this.answers.length; i++) {
			this.answers[i].pos.x = xHolder - 120;
			this.answers[i].pos.y = yHolder;
			xHolder += 120;
		}
		this.displayed = true;
		this.placementTimer.reset();	
	},

	activateMotion: function() {
		for(var i = 0; i < this.answers.length; i++) {
			this.answers[i].friction.x = 40;
			var l_condition = (this.answers[i].pos.x < this.carrier.pos.x - 40);
			var r_condition = (this.answers[i].pos.x > this.carrier.pos.x + 160);

			if(!l_condition && (!r_condition) && (!this.answers[i].hasStarted)) 
				this.answers[i].accel.x = -40;

			if(l_condition || r_condition) {
				if(!this.answers[i].hasBrake) {
					this.answers[i].accel.x = 0;			
					this.answers[i].hasBrake = true;
				}
			}

			if(this.answers[i].hasBrake && this.answers[i].vel.x == 0) {
				if(l_condition) this.answers[i].accel.x = 40;
				if(r_condition) this.answers[i].accel.x = -40;
			}

			/*if(this.answers[i].vel.x == 0) {
				this.answers[i].friction.x = 0;
				if(l_condition) this.answers[i].accel.x = 50;
				if(r_condition) this.answers[i].accel.x = -50;
			}*/
		}
	}

});

});