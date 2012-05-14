var StateManager = {
  _planet:          ''
  ,_state:          'init'
  ,_currentPlanet:  ''
  ,_currentCycle:   ''
  ,_currentLap:     0
  ,_countdownStart: null
  ,_lastCount:      0
  ,_laps:           {}
  ,_planetText:     null
  ,keyEntities:     {}
  ,mouseEntity:     null
  ,touchEntities:   {}
  ,playerCount:     0
  ,bannerText:      null
  ,bylineText:      null

  ,init: function() {
    Crafty.bind( 'enter-countdown', startCountdown );
    Crafty.bind( 'trans-countdown-countdown', startCountdown );
    Crafty.bind( 'leave-countdown', stopCountdown );
    Crafty.bind( 'enter-finish', finishRace );

    Crafty.bind( 'WindowResize', centerPlanet );
  }

  ,state: function( new_state ) {
    if ( new_state ) {
      var old_state = this._state;

      // TRIGGER: leaving-state
      if ( new_state != old_state ) {
        Crafty.trigger( 'leave-' + this._state );
      }

      transition  = old_state + '-' + new_state;
      this._state = new_state;

      // TRIGGER: trans-oldstate-newstate
      Crafty.trigger( 'trans-' + transition );

      // TRIGGER: enter-newstate
      if ( new_state != old_state ) {
        Crafty.trigger( 'enter-' + this._state );
      }
    }

    return this._state;
  }

  ,cycle: function( new_cycle ) {
    if ( new_cycle ) {
      this._currentCycle = new_cycle;
    }

    return this._currentCycle;
  }

  ,planet: function( new_planet ) {
    if ( new_planet ) {
      this._currentPlanet = new_planet;
    }

    return this._currentPlanet;
  }

  ,planetSprite: function() {
    if ( ! this._planetSprite ) {
      var planet  = Crafty.e( '2D, Canvas, Tween, world_' + this.planet() );
      this._planetSprite = planet;
      centerPlanet();

      var planetText = Crafty.e( '2D, DOM, Text, planet-text' )
        .attr({
          w: planet.w
          ,h: planet.h / 2
        })
        .css({ 'font-size': (planet.h / 2).toString() + 'px' });
      planetText.x = center_in_x(planet.w);
      planetText.y = center_in_y(planet.h / 2);
      planetText.text( GameConfig.planets[this.planet()].lapCount );
      this._planetText = planetText;

      this._planetSprite.attach( this._planetText );
    }

    return this._planetSprite;
  }

  // method:: 'mouse', 'touch', 'key'
  // address:: null, coordinate pair, key code
  ,addPlayer: function( method, address ) {
    var newEntity = Crafty.e( 'Unicycle' )
        .cycle( this.cycle() )
        .controls( method, address )
        .tint( PlayerColors[this.playerCount % PlayerColors.length], 0.4 );

    switch ( method ) {
      case 'mouse':
        this.mouseEntity = newEntity;
        break;
      case 'touch':
        this.touchEntities[address] = newEntity;
        break;
      default:
        this.keyEntities[address] = newEntity;
    }

    this._laps[address] = 0;

    window.juke.play( 'click' )
    this.playerCount++;
    //console.log('player added: ' + this.playerCount.toString() + ' total');

    this.state('countdown');
  }

  ,removePlayer: function( method, address ) {
    if ( this.playerCount == 1 ) {
      this.state('attract');
    } else {
      this.state('countdown');
    }

    switch ( method ) {
      case 'mouse':
        this.mouseEntity && this.mouseEntity.destroy();
        this.mouseEntity = null;
        break;
      case 'touch':
        this.touchEntities[address] && this.touchEntities[address].destroy()
        delete this.touchEntities[address];
        break;
      default:
        this.keyEntities[address] && this.keyEntities[address].destroy();
        delete this.keyEntities[address];
    }

    delete this._laps[address];

    window.juke.play( 'bubble' );
    this.playerCount--;
    //console.log( 'player removed: ' + this.playerCount.toString() + ' remaining' );
  }

  ,countLap: function( address ) {
    this._laps[address] += 1;
    window.juke.play('lap_ding');

    if ( this._laps[address] > this._currentLap ) {
      this._currentLap++;
      this._planetText.text( GameConfig.planets[this.planet()].lapCount
                             - this._currentLap );
    }

    if ( this._laps[address] >= GameConfig.planets[this.planet()].lapCount ) {
      this.state('finish');
    }
  }

  ,getWinner: function() {
    return this._winner;
  }

  ,reset: function() {
    self = StateManager;

    self._planetSprite.destroy();
    self.bannerText.destroy();
    self._planetText.destroy();
    self.bylineText.destroy();
    //self.mouseEntity && self.mouseEntity.destroy();
    // _.chain(self.keyEntities).values().each(function(e){
    //   e.destroy();
    // });
    // _.chain(self.touchEntities).values().each(function(e){
    //   e.destroy();
    // })
    self._planetSprite    = null;
    self._state           = 'init';
    self._planet          = '';
    self._state           = 'init';
    //self._currentPlanet   = '';
    //self._currentCycle    = '';
    self._countdownStart  = null;
    self._lastCount       = 0;
    self._currentLap      = 0;
    self._laps            = {};
    self.keyEntities      = {};
    self.mouseEntity      = null;
    self.touchEntities    = {};
    self.playerCount      = 0;
    self.bannerText       = null;
    self._planetText      = null;
    self.bylineText       = null;
  }
}


function centerPlanet() {
  var planet = StateManager._planetSprite;
  planet.x = center_in_x( planet.w );
  planet.y = center_in_y( planet.h );
}

function startCountdown() {
  if ( StateManager.playerCount > 0 ) {
    stopCountdown();
    StateManager._countdownStart = new Date;
    Crafty.bind('EnterFrame', doCountdown );
  }
}

function stopCountdown() {
  StateManager._countdownStart = null;
  Crafty.unbind( 'EnterFrame', doCountdown );
}

function getCountdown() {
  if ( StateManager._countdownStart == null ) return 0;

  var elapsed = Timer.now() - StateManager._countdownStart;
  return Math.ceil( GameConfig.raceCountdownTime - elapsed / 1000 );
}

// Called on Enterframe, plays sounds & transitions from countdown to race
function doCountdown() {
  if ( StateManager.state() == 'countdown' ) {
    var curCount = getCountdown();

    if ( curCount != StateManager._lastCount ) {
      Crafty.trigger( 'CountdownTick', curCount );
      var tone = curCount == 0 ? 'start_tone' : 'countdown_tone';
      window.juke.play( tone );
    }

    if ( curCount <= 0 ) {
      StateManager.state( 'race' );
    }

    StateManager._lastCount = curCount;
  }
}

function finishRace() {
  window.juke.play( 'crowd_noise' );

  var laps    = StateManager._laps;
  var winner  = _.chain(laps).keys().max( function(k){
    return laps[k];
  }).value();
  StateManager._winner = Crafty.keyNames[winner].replace( '_', ' ' );

  setTimeout( function() {
    StateManager.reset();
    Crafty.scene('main');
  }, 5000 );
}

