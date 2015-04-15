ig.module( 
  'game.entities.frames.frame' 
)
.requires(
  'impact.entity'
)
.defines(function() {
 
EntityFrame = ig.Entity.extend({
        
    font: null,
    text: null,
    carrier: null,
    animSheet: null,
    size: { x: 75, y: 23 },   
    textPos: { x: 37, y: 8 },
    defPos: {x: null, y: null},
    textAlign: ig.Font.ALIGN.CENTER, 
           
	init: function( x, y, settings ) {	
	   	this.animSheet = new ig.AnimationSheet('media/pictures/button.png', 75, 23);
        this.addAnim('selected', 1, [2]);
        this.addAnim('unselected', 1, [0]);	
        this.currentAnim = this.anims.unselected;
        this.font = ig.game.font;
      	this.parent(x, y, settings);  
    },
    
    update: function() {
    	if(this.carrier && this.carrier._killed) {
            this.erase();
            return;
        } 

		this.parent();
    },

    draw: function() {
        this.parent();

        //if no font has loaded it is useless to continue updating process
        if(!this.font) return;
           
        for ( var i = 0; i < this.text.length; i++ ) {
	        this.font.draw(this.text[i], this.pos.x + this.textPos.x - ig.game.screen.x, 
	        this.pos.y + ((this.font.height + 2) * i) + this.textPos.y - ig.game.screen.y, 
	        this.textAlign);
	    }
    },

    erase: function() {
        if((this.pos.x + this.size.x) < ig.game.backAxis) this.kill();  
    },

    /*angleTo is basically an ig.Entity's method
    *the original method could only get an angle to an Entity object
    *this overriding provides us a way to get an angle from any other object
    */
    angleTo: function(other) {
        return Math.atan2(
            (other.y) - (this.pos.y + this.size.y/2),
            (other.x) - (this.pos.x + this.size.x/2)
        );
    }

});
 
});