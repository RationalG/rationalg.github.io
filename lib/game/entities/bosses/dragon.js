ig.module( 
	'game.entities.bosses.dragon' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityDragon = ig.Entity.extend({

	question: null,
	isLanded: false,
	isPreparedToLand: false,
	size: {x: 307, y: 208},
	scrollSpeed: {x: 0, y: 15},

	/*must be optimized to avoid framerate loss*/
	init: function(x, y, settings) {
		this.name = 'dragonOrb';
		//sprite is huge and need behind-optimisation to avoid any framerate loss
		this.animSheet = new ig.AnimationSheet('media/pictures/dragonBoss.png', 307, 208);
		this.addAnim('idle', 0.1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
			17, 18, 19, 20]);
		this.parent(x, y, settings);
	},

	/*once landed, the dragon will enter the questionning phase and the player
	*will have to answer to repeat the entire process (except the landing)
	*the bosses have to be able to launch other types of phases
	*/
	update: function() {
		this.pos.x += this.scrollSpeed.x;
		this.pos.y += this.scrollSpeed.y;
		this.scrollSpeed.y = (this.pos.y <= 395 && this.isPreparedToLand) ? 15 : 0;

		//if(!this.question && this.isLanded) this.askQuestion();
		//if(this.question && this.frames) this.answerQuestion();

		this.parent();
	},

	/*when the waves are all completed, the boss spawning process happens through a landing phase
	*this happens too for the player, excepted that the player will land first
	*the landing triggers an earthquake which provokes a screen shaking
	*/
	land: function() {
		if(!this.isPreparedToLand) {
			ig.game.alertTimer.flag = false;
			this.pos.x = ig.game.frontAxis - this.size.x;
			this.pos.y = ig.game.topAxis - this.size.y;
			this.isPreparedToLand = true;
		}

		if(this.scrollSpeed.y == 0 && (!this.isLanded)) {
			ig.game.screenShaker.timedShake(50, 2);
			this.isLanded = true;
		} 
	},

	askQuestion: function() {
		var randomQuestion = ig.game.getRandomElement(dictionary.questions);
		
		this.question = ig.game.spawnEntity(EntityQuestion, this.pos.x, this.pos.y, {
			carrier: this,
			text: [randomQuestion.header],
			question: randomQuestion
		});

	},

	answerQuestion: function() {
		//
	},

	detectInput: function() {
		//
	}
	
});

});