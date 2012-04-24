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
      this.requires( '2D, Canvas, Tint' );
      this.bind( 'EnterFrame', this.enterFrame );

      // Start on top of the planet
      planetName   = StateManager.planet();
      planetSprite = StateManager.planetSprite();
      this.attr({ w: 48, h: 48 });
      this.origin('center');

      return this;
    }

    ,cycle: function( cycleName ) {
      this._cycleName   = cycleName = cycleName.toLowerCase();
      this._accelFactor = GameConfig.cycles[cycleName].accelFactor;
      this._maxVelocity = GameConfig.cycles[cycleName].maxVelocity;
      this._spriteName  = 'unicycle_' + cycleName;
      this.requires( this._spriteName );

      this.ready = true;
      this.trigger('Change');

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

    ,enterFrame: function(frame) {
      var dt = Timer.dt;
      planet = GameConfig.planets[StateManager.planet()];

      switch ( StateManager.state() ) {
        case 'attract', 'countdown':
          break;
        case 'race':
          if ( ! this.isAirborne ) {
            this._velocity += this._accelFactor * dt;
          }
          this._velocity -= planet.friction * dt;
          this._velocity  = clampVal( this._velocity, 0, this._maxVelocity );
          //console.log([ dt, this._accelFactor, planet.friction, this._maxVelocity, this._velocity ]);
          break;
        case 'finish':
          break;
      }

      // Linear velocity is pct of circumference, convert to angular
      two_pi = 2.0 * Math.PI;
      altitude = planet.radius + this.h / 2.0;
      circumference = altitude * two_pi;
      rotation_incr = ( (this._velocity / circumference) * 360 );

      // Rotation grows from 0 to -360 for counter-clockwise racing
      new_rotation  = ( this.rotation - rotation_incr ) % 360;

      if ( Math.abs( this.rotation - new_rotation ) > 350 ) {
        StateManager.countLap( this._controlAddress );
      }

      this.rotation = new_rotation;

      // Move the player on the surface of the planet
      angle = (this.rotation - 90) * DEG_TO_RAD;
      this.x = Math.cos( angle ) * altitude + origin().x - this.w / 2;
      this.y = Math.sin( angle ) * altitude + origin().y - this.h / 2;

      // calculate centripetal force based on new velocity
      //this.isAirborne = ( self._radius > Race.planet.radius );
    }
    // track:
    //   key bound to this player
    //   mouse coordinates + radius bound to this player
    //   player velocity
    //

  });

});