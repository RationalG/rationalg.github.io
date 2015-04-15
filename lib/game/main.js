ig.module( 
	'game.main' 
)
.requires(
	//impact librairies
	'impact.game',
	'impact.font',
	'impact.debug.debug',
	'plugins.screenshaker',
	'game.levels.level1',
	'game.entities.player.player',
	'game.entities.player.lifemeter',
	'game.entities.ennemies.orb',
	'game.entities.ennemies.ennemy',
	'game.entities.frames.frame',
	'game.entities.frames.label',
	'game.entities.frames.question',
	'game.entities.bosses.dragon',
	'game.entities.projectiles.fireball',
	'game.entities.projectiles.lightball',
	'game.entities.projectiles.explosion',
	'game.entities.projectiles.meteorite',
	'game.entities.system.scripter'	
)
.defines(function(){

	Sunburst = ig.Game.extend({

		/*assets*/
		font: new ig.Font('media/fonts/04b03.font.png'),
		pixel: new ig.Font('media/fonts/pixel.font.png'),
		//waveUpdateSound: new ig.Sound('media/sounds/warp.ogg'),

		/*screen borders*/
		topAxis: 0,
		backAxis: 0,
		frontAxis: 0,
		bottomAxis: 0,

		/*screen related data*/
		scrollSpeed: {x: 5, y: 0},
		center: {x: null, y: null},
		
		/*wave-related data*/
		orbs: [],
		completedWaves: 0,
		isParametersLoaded: null,

		/*timers for message writing*/
		alertTimer: {clock: new ig.Timer(), flag: false},
		messageTimer: {clock: new ig.Timer(), flag: false},
		stageTimer: {clock: new ig.Timer(), flag: false, x: 0, y: 260},
		
		/*earthquake trigger*/
		screenShaker: null,
		entityScripter: null,
		mapHandler: null,

		/*final ennemy entity of the level*/
		boss: null,
		
		/*init function works the same way for every module :
		* once a module is loaded, or once an entity is spawned, it's
		* init method is called automatically before any update or draw process
		* related to the class
		*/
		init: function() {
			ig.input.bind(ig.KEY.TAB, 'pause');
			//this.playMusic('media/sounds/serris.ogg');
			this.loadLevel(LevelLevel1);	
			this.stageTimer.clock.set(360);
			this.entityScripter = ig.game.spawnEntity(EntityScripter, 0, 0);
			this.screenShaker = new ScreenShaker();
		},

		/*will be loaded once at the beginning, and once a wave is totally destroyed.
		*at the beginning of the game, this spawns the player entity
		*be sure to not spawn multiple player entities during one level
		*/
		loadLevelParameters: function() {
			if(this.isParametersLoaded || typeof this.frontAxis === 'undefined') 
				return;

			this.waveUpdate(Level1Waves, this.completedWaves);
			this.orbs = this.getPropertyName(ig.game.namedEntities);

			if(!ig.game.player) ig.game.spawnEntity(EntityPlayer, 124, 172);	

			this.isParametersLoaded = true;
		},

		/*overrides update mother class method. called during each frame
		*manage pause feature, values related to the screens, scrollspeed,
		*messages timer, and the screenshaker which is an entity able to trigger 
		*earthquakes and/or shaking view 
		*/
		update: function() {
			this.managePausing();

			if (this.paused) return;

			this.manageGameFrame();

			if(!this.isParametersLoaded) this.loadLevelParameters();

			ig.game.screen.x += this.scrollSpeed.x;
			ig.game.screen.y += this.scrollSpeed.y;

			if(this.orbs.length == 0) this.resetWave();

			this.manageTime();
			this.screenShaker.update();	
			this.parent();
		},

		/*this function is used to draw additionnal stuff not managed by the engine himself
		* draw mother class method is the one who draw backgrounds & entities
		*/
		draw: function() {
			this.parent();

			if(this.stageTimer.clock.delta())
				this.font.draw(this.stageTimer.clock.delta().toFixed(2) + " seconds remaining", 
					ig.system.width/2, this.stageTimer.y, ig.Font.ALIGN.CENTER);
				
			if(this.messageTimer.flag == true) {
				this.font.draw("Wave " + this.completedWaves + " destroyed" , ig.system.width/2, 232, ig.Font.ALIGN.CENTER);
			}

			if(this.alertTimer.flag == true) {
				this.pixel.draw("Boss alert", ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER);
			}

			if (this.paused) {     
        		this.font.draw(" - Paused - ", 100, 232, ig.Font.ALIGN.CENTER);  
    			return;                
    		}
		},

		/*get side borders position of screen and set the
		*central point of the screen
		*/
		manageGameFrame: function() {	
   		 	this.topAxis = ig.game.screen.y;
			this.backAxis = ig.game.screen.x;
			this.frontAxis =  this.backAxis + ig.system.width;
			this.bottomAxis = this.topAxis + ig.system.height;		
			this.center.x = this.backAxis + (ig.system.width/2);
			this.center.y = this.topAxis + (ig.system.height/2);
		},

		/*load data from a variable containing JSON datas related to the current level
		*spawn ennemy waves and pass them parameters related to their behavior and skins
		*and tell the player how many waves he destroyed
		*/
		waveUpdate: function(data, index) {
			if(index == data.waves.length - 1) {
				this.initializeBossPhase();
				return;
			}

			//this.waveUpdateSound.play();
			if(this.completedWaves) this.messageTimer.flag = true;		
			this.messageTimer.clock.set(3);

			var settings = {
				name: null, 
				shootDirection: null,
				skin: data.waves[index].skin,
				timer: data.waves[index].timer
			};

			for(var i = 0; i < data.waves[index].nbOrbs; i++) {
				settings.name = data.waves[index].orbs[i].name;
				settings.shootDirection = data.waves[index].orbs[i].shootDirection;
				ig.game.spawnEntity(EntityOrb, 
					this.frontAxis + data.waves[index].orbs[i].x, 
					this.topAxis + data.waves[index].orbs[i].y,
					settings);
			}

			if(data.waves[index+1].event) this.entityScripter.preparedEvent = data.waves[index+1].event;
		},

		/*is responsible for making the player landing, alerting the player that we
		*enter a new gameplay phase and preparing boss' update process
		*/
		initializeBossPhase: function() {
			ig.game.player.speed.x++;
			ig.game.player.onAccelerate = true;
			this.boss = ig.game.spawnEntity(EntityDragon, 0, 0);
			this.alertTimer.flag = true;
			this.alertTimer.clock.set(1);		
		},

		/*called during every wave completion
		*setting isParametersLoaded to NULL will allow update method to reinitialize
		*a wave and all its JSON parameters
		*/
		resetWave: function() {
			if(this.entityScripter.preparedEvent){
				this.entityScripter.event = this.entityScripter.preparedEvent;
				this.entityScripter.preparedEvent = null;
			}
			
			if(!this.entityScripter.event || !this.entityScripter.mono) {
				this.isParametersLoaded = null;
				this.completedWaves++;
			}
		},

		/*is responsible for alerting the player about events during the level. each timer object
		*has a boolean flag to trigger message writing, letting the draw method to use fonts and
		*display messages
		*/
		manageTime: function() {
			//wave alert
			if(this.messageTimer && this.messageTimer.clock.delta() > 0) { 
				this.messageTimer.clock.reset(); 
				this.messageTimer.flag = false;
			}

			//boss alert
			if(this.alertTimer.flag == true) { 
				this.pixel.alpha = Math.abs(this.alertTimer.clock.delta());
				if(this.alertTimer.clock.delta() > 0) this.alertTimer.clock.set(1);
			}
		},

		/*decides if the player typed fast enough or not*/
		measurePerformance: function(aim) {
			var resultMessage = (aim.excellenceTimer.delta() < 2.5) ? "EXCELLENT" : "TOO SLOW";
			aim.frame.text = [resultMessage];		
		},

		/*allows us to retrieve data from ig.game.namedEntities array. Since ennemies are the only ones
		* gifted with a name, we'll use this array to fulfill our orbs array
		*/
		getPropertyName: function(object) {		
			if(!(object && typeof object === 'object'))
				return null;
			
			var result = [];
	
			for(var key in object) {
				if(object.hasOwnProperty(key)) {
					result.push(key);
				}
			}
			
			return result;
		},

		/*mostly used to get random letters, words and questions from dictionary*/
		getRandomElement: function(object) {
			var index = Math.floor((Math.random()*object.length - 1) +1);	
			return object[index];
		},

		/*simple pause feature*/
		managePausing: function() {
			if(ig.input.pressed('pause') && this.pausing) {
				this.pausing = false;
			}

    		if (ig.input.pressed("pause")) {       
        		if (!this.pausing) {
            		this.paused = (this.paused) ? false : true;
            		this.pausing = true;
            	}
        	}
		},

		/*simple music playlist builder*/
		playMusic: function(song) {
			ig.music.add(song);
			ig.music.volume = 0.5;
			ig.music.play();
		}
	});

	ig.main( '#canvas', Sunburst, 60, 640, 280, 2);

});