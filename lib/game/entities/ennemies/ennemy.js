ig.module(
	'game.entities.ennemies.ennemy'
)
.requires(
	'impact.entity',
	'impact.input'
).defines(function() {
	
	EntityEnnemy = ig.Entity.extend({

	size: null,
	word: null,
	frame: null,
	wordLength: null,
	wordOnScreen: null,
	visualState: null,
	excellenceTimer: new ig.Timer(),

	/*each standard ennemy carry a sign with a label to type
	*once the panel is initialized, we enable the associated inputs only
	*each letter equals to one life point
	*/
	init: function(x, y, settings) {
		this.timerKey = 'timer' + this.name;
		this[this.timerKey] = new ig.Timer();
		this[this.timerKey].set(settings.timer);

		this.word = ig.game.getRandomElement(dictionary.words);
		this.wordOnScreen = this.word;
		this.wordLength = this.word.length;

		this.frame = ig.game.spawnEntity(EntityLabel, this.pos.x, this.pos.y, {
			carrier: this,
  			text: [this.wordOnScreen]
  		});

  		this.setInputs();
  		this.health = this.word.length;
		this.parent(x, y, settings);
	},

	/*each ennemy balace between two general state : offScreen and onScreen
	* these states orchestrate the motion of these entities once onScreen
	* its timer regulates shoot cadency
	*/
	update: function() {
		this.visualState = (this.pos.x > ig.game.backAxis && this.pos.x < ig.game.frontAxis) ? 
			'onScreen' : 'offScreen';

		if(this.visualState == 'onScreen') this.detectInput();			

		this.parent();
	},

	/*draw nothing particular since the Frame class is entierely responsible for everything
	*related to the label system
	*/
	draw: function() {
		this.parent();
	},

	/*this function is responsible for trigerring the inputs associated to the labeL
	*if the player pushes the right input, the function makes him shoot towards this entity
	*/
	detectInput: function() {
		if(ig.input.pressed(this.word.charAt(0))) {
			if(!ig.game.player.aim) {
				ig.game.player.aim = this;
				this.frame.currentAnim = this.frame.anims.selected;
				this.excellenceTimer.set(0);
			}

			if(ig.game.player.aim == this) {
				this.word = this.word.slice(1);
				this.setInputs();
				ig.game.player.shoot(this);	
			}
		}
	},

	//bind the right letter to type regarding the remaining letter of the label
	setInputs: function() {
		if(ig.KEY[this.word.charAt(0)]) ig.input.bind(ig.KEY[this.word.charAt(0)], this.word.charAt(0));
	},
	
	//will inflicts damage to EntityPlayer
	shoot: function() {
		if(this[this.timerKey].delta() <= 0) return;
		this[this.timerKey].reset();
		ig.game.spawnEntity(EntityLightball, this.pos.x, this.pos.y, this);
	}

});

});