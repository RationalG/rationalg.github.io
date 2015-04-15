ig.module( 
  'game.entities.frames.label' 
)
.requires(
  'impact.entity',
  'game.entities.frames.frame'
)
.defines(function() {

EntityLabel = EntityFrame.extend({

	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},

	update: function() {
		
		if(this.carrier) {
			this.pos.x = this.carrier.pos.x - this.size.x;
			this.pos.y = this.carrier.pos.y - this.size.y;
		}

		this.parent();
	},

	draw: function() {
		this.parent();
	}

});

});