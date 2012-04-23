// helpers.js

function center_in_x(val) {
  return SCREEN_WIDTH / 2.0 - val / 2.0;
}

function center_in_y(val) {
  return SCREEN_HEIGHT / 2.0 - val / 2.0;
}

function clampVal( val, min, max ) {
  val < min && (val = min);
  val > max && (val = max);
  return val;
}

// Fade to black over duration millisecs
function fadeToBlack( duration ) {
  _doFadeBlack( 0.0, 1.0, duration );
}

// Fade from black to clear over duration millisecs
function fadeFromBlack( duration ) {
  _doFadeBlack( 1.0, 0.0, duration );
}

// Fade a black layer from startAlpha to endAlpha over duration millisecs
function _doFadeBlack( startAlpha, endAlpha, duration ) {
  return Crafty.e("2D, DOM, Box, Tween, Color")
    .attr({ x: 0, y: 0, w: SCREEN_WIDTH, h: SCREEN_HEIGHT, z: Layer.HUD_FG, alpha: startAlpha })
    .color( 'black' )
    .tween({ alpha: endAlpha }, ( duration / 1000 ) * Crafty.timer.getFPS() );
}

var Timer = {
  _lastTick:  null
  ,dt:        0

  ,tick: function() {
    now = new Date;

    if ( _lastTick == null ) _lastTick = now;

    this.dt = now - this._lastTick;
    this._lastTick = now;
  }

  ,now: function() { return new Date; }
}

var GameConfig = {
  raceCountdownTime: 3
  ,cycles: {
    slow:     { accelFactor: 0.2, mass: 10 }
    ,normal:  { accelFactor: 0.3, mass: 7 }
    ,fast:    { accelFactor: 0.4, mass: 4 }
  }
  ,planets: {
    fire:     { gravity: 5, radius: 80, friction: 0.1 }
    ,jungle:  { gravity: 5, radius: 80, friction: 0.1 }
    ,rock:    { gravity: 5, radius: 80, friction: 0.1 }
  }
};

var Layer = {
  INPUT:    12
  ,HUD_FG:  10
  ,HUD_BG:  9
  ,EFFECTS: 7
  ,SPRITES: 5
  ,BG:      0
};

var Race = {
  started: false
}

var StateManager = {
  _planet:          ''
  ,_players:        null
  ,_state:          'init'
  ,_currentPlanet:  ''
  ,_currentCycle:   ''
  ,_countdownStart: null
  ,_lastCount:      0
  ,_callbackID:     null
  ,keyEntities:     {}
  ,mouseEntity:     null
  ,touchEntities:   {}

  ,state: function( new_state ) {
    if ( new_state ) {
      transition  = this._state + '-' + new_state;
      this._state = new_state;

      switch ( transition ) {
        case 'attract-countdown':
          this.startCountdown();
          break;
        case 'countdown-attract':
          this.stopCountdown();
          break;
        case 'countdown-race':
          break;
        case 'race-finish':
          window.juke.play( 'crowd_noise' );
          $('body').delay( 3000 ).queue( function() { /* TODO reset */ } );
          break;
        case 'finish-attract':
          break;
      }

      switch ( this._state ) {
        case 'attract':
          break;
        case 'countdown':
          break;
        case 'race':
          break;
        case 'finish':
          break;
      }
    }

    return this._state;
  }

  ,planet: function( new_planet ) {
    if ( new_planet ) {
      this._currentPlanet = new_planet;
    }

    return this._currentPlanet;
  }

  ,cycle: function( new_cycle ) {
    if ( new_cycle ) {
      this._currentCycle = new_cycle;
    }

    return this._currentCycle;
  }

  ,addPlayer: function( method, address ) {
    newEntity = Crafty.e( 'Unicycle' )
        .cycle( this.cycle() )
        .controls( method, address );

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

    console.log('player added');
    window.juke.play( 'click' )
    this.playerCount++;

    this.state('countdown');
  }

  ,removePlayer: function( method, address ) {
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

    console.log( 'player removed' );
    window.juke.play( 'bubble' );
    this.playerCount--;

    if ( _(['attract', 'countdown']).include( this.state() ) ) {
      this.playerCount == 0 ? this.state('attract') : this.state('countdown');
    }
  }

  ,startCountdown: function() {
    switch ( this.state() ) {
      case 'attract':
      case 'countdown':
        if ( this.playerCount > 0 ) {
          this._countdownStart = new Date;
          this._callbackID = Crafty.bind('Enterframe', this.doCountdown );
        }
    }
  }

  ,stopCountdown: function() {
    this._countdownStart = null;
    Crafty.unbind( this._callbackID );
  }

  ,getCountdown: function() {
    if ( this._countdownStart == null ) return 0;

    var elapsed = Timer.now() - this._countdownStart;
    return Math.ceil( GameConfig.raceCountdownTime - elapsed );
  }

  // Called on Enterframe, plays sounds & transitions from countdown to race
  ,doCountdown: function() {
    var curCount = this.getCountdown();

    if ( curCount != this._lastCount ) {
      var tone = curCount == 0 ? 'start_tone' : 'countdown_tone';
      window.juke.play( tone );
    }

    if ( curCount == 0 ) {
      this.state( 'race' );
      this.stopCountDown();
    }

    this._lastCount = curCount;
  }
}