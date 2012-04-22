$(function(){
  Crafty.c('Unicycle', {
    _cycleName:       null
    ,_spriteName:     null
    ,_controlMethod:  null
    ,_controlAddress: null
    ,_lastTick:       null
    ,_accelFactor:    0
    ,_velocity:       0
    ,_angle:          0
    ,_radius:         0
    ,_originX:        0
    ,_originY:        0
    ,isAirborne:      false

    ,init: function() {
      this.require( '2D, Canvas' );
      this.bind( 'EnterFrame', this.enterFrame );
      return this;
    }

    ,cycle: function( cycleName ) {
      this._cycleName = cycleName = cycleName.toLowerCase();
      this._spriteName = 'unicycle_' + cycleName;
      this._accelFactor = GameConfig.cycles[cycleName].accelFactor;
      this.require( this._spriteName );
      return this;
    }

    // Expects method 'mouse', 'touch' or 'keyboard'
    // Expects address to be keyboard keyname string or object with .x and .y
    ,controls: function( method, address ) {
      if ( arguments.length == 2 ) {
        this._controlMethod   = method.toLowerCase;
        this._controlAddress  = address;
      }

      return this;
    }

    ,enterFrame: function() {
      if ( Race.started && this._lastTick != null ) {
        deltaTime = (new Date) - this._lastTick;

        this.isAirborne = ( self._radius > Race.planet.radius );
        // apply acceleration to velocity
        // calculate centripetal force based on new velocity
      }

      this._lastTick = new Date;
    }
    // track:
    //   key bound to this player
    //   mouse coordinates + radius bound to this player
    //   player velocity
    //

  });

});