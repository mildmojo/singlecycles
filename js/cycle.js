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
    ,_nameText:       null
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

      this.enterFrame();
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

        if ( this._nameText ) {
          this._nameText.destroy();
        }

        var playerName;

        switch ( true ) {
          case method == 'mouse':
            playerName = 'Rodent';
            break;
          case method == 'touch':
            playerName = 'Finger';
            break;
          default:
            playerName = Crafty.keyNames[address].replace( '_', ' ' );
        }

        // Add floating player name above player sprite
        var height = playerName.length > 8 ? this.h / 4 : this.h / 3;
        this._nameText = Crafty.e( '2D, DOM, Text, player-name' )
          .attr({
            w: this.w * 2,
            h: height,
            x: (this.x + this.w / 2) - this.w,
            y: this.y - (this.h / 3) * 2
          })
          .css({ 'font-size': height })
          .text( playerName );
        // Move with player sprite
        this.attach( this._nameText );
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
          //console.log([this._accelFactor, this.isAirborne]);
          if ( ! this.isAirborne ) {
            this._velocity += this._accelFactor * dt;
          }
          this._velocity -= planet.friction * dt;
          this._velocity  = clampVal( this._velocity, 0, this._maxVelocity );
          //console.log([ dt, this._accelFactor, planet.friction, this._maxVelocity, this._velocity ]);
          break;
        case 'finish':
          this._velocity -= planet.friction * dt;
          this._velocity  = clampVal( this._velocity, 0, this._maxVelocity );
          break;
      }

      // Linear velocity is pct of circumference, convert to angular
      two_pi = 2.0 * Math.PI;
      altitude = this._radius + this.h / 2.0;
      circumference = altitude * two_pi;
      rotation_incr = ( (this._velocity / circumference) * 360 );

      // Rotation grows from 0 to -360 for counter-clockwise racing
      new_rotation  = ( this.rotation - rotation_incr ) % 360;

      if ( Math.abs( this.rotation - new_rotation ) > 350 ) {
        StateManager.countLap( this._controlAddress );
      }

      this.rotation = new_rotation;
      this._nameText && (this._nameText.rotation = new_rotation);

      // Move the player on the surface of the planet
      angle = (this.rotation - 90) * DEG_TO_RAD;
      this.x = Math.cos( angle ) * altitude + origin().x - this.w / 2;
      this.y = Math.sin( angle ) * altitude + origin().y - this.h / 2;

      cycle = GameConfig.cycles[this._cycleName]

      // calculate centripetal force based on new velocity
      // upforce     = ( cycle.mass * this._velocity * this._velocity) / this._radius;
      // //upforce    *= 8; // FUDGE FACTOR
      // downforce   = planet.gravity * cycle.mass;
      // vert_force  = upforce - downforce;
      // //console.log([upforce, downforce, vert_force]);
      // //console.log(vert_force);
      // this._radius += vert_force;
      // this._radius  = clampVal( planet.radius, planet.radius * 2, this._radius );

      // is_airborne = ( this._radius > planet.radius * 1.05 );

      if ( this._velocity > cycle.maxVelocity - 1 ) {
        this._radius += 65 * dt;
      } else {
        this._radius -= 18 * dt;
      }

      this._radius = clampVal( this._radius, planet.radius, planet.radius * 2 );

      var is_airborne = false;

      if ( this.isAirborne ) {
        is_airborne = this._radius > planet.radius * 1.01;
      } else {
        is_airborne = this._radius > planet.radius * 1.15;
      }

      if ( is_airborne && ! this.isAirborne ) {
        //console.log('air!');
        window.juke.play('liftoff');
      }

      this.isAirborne = is_airborne;
    }
    // track:
    //   key bound to this player
    //   mouse coordinates + radius bound to this player
    //   player velocity
    //

  });

});
