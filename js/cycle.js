$(function(){
  Crafty.c('Unicycle', {
    _cycleName:       null
    ,_spriteName:     null
    ,_controlMethod:  null
    ,_controlAddress: null
    ,_accelFactor:    0
    ,_velocity:       0
    ,_maxVelocity:    0
    ,_angle:          0
    ,_radius:         0
    ,_originX:        0
    ,_originY:        0
    ,_joinTimerStart: null
    ,isAirborne:      false

    ,init: function() {
      this.requires( '2D, Canvas' );
      this.bind( 'EnterFrame', this.enterFrame );
      return this;
    }

    ,cycle: function( cycleName ) {
      this._cycleName   = cycleName = cycleName.toLowerCase();
      this._spriteName  = 'unicycle_' + cycleName;
      this._accelFactor = GameConfig.cycles[cycleName].accelFactor;
      this._maxVelocity = GameConfig.cycles[cycleName].maxVelocity;
      this.requires( this._spriteName );
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

    ,joinTimer: function() {
      if ( this._joinTimerStart == null ) this._joinTimerStart = Timer.now();
      return Timer.now() - this._joinTimerStart;
    }

    ,go: function() {
      this._accelFactor = GameConfig.cycles[this._cycleName].accelFactor;
    }

    ,stop: function() {
      this._accelFactor = 0;
    }

    ,enterFrame: function() {
      var dt = Timer.dt;
      planet = GameConfig.planets[StateManager.planet()];

      switch ( StateManager.state() ) {
        case 'attract', 'countdown':
        case 'race':
          this._velocity += this._accelFactor * dt;
          this._velocity -= planet.friction * dt;
          this._velocity  = clampVal( this._velocity, 0, this._maxVelocity );
        case 'finish':
          this._
      }

      // Linear velocity is pct of circumference, convert to angular
      circumference = planet.radius * 2.0 * Math.pi;
      this._angle  += (this._velocity / circumference) * 360;

      // Move the player on the surface of the planet
      this.x = Math.cos( this._angle ) * planet.radius + planet.originX;
      this.y = Math.sin( this._angle ) * planet.radius + planet.originY;

      this.rotation = this._angle;

      // calculate centripetal force based on new velocity
      // this.isAirborne = ( self._radius > Race.planet.radius );
    }
    // track:
    //   key bound to this player
    //   mouse coordinates + radius bound to this player
    //   player velocity
    //

  });

});