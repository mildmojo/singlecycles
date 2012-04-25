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

  ,state: function( new_state ) {
    if ( new_state ) {
      transition  = this._state + '-' + new_state;
      this._state = new_state;

      switch ( transition ) {
        case 'attract-countdown':
        case 'countdown-countdown':
          this.startCountdown();
          break;
        case 'countdown-attract':
        case 'countdown-race':
          this.stopCountdown();
          break;
        case 'race-finish':
          window.juke.play( 'crowd_noise' );

          var self = this;
          var laps = this._laps;
          var winner = _.chain(laps).keys().max( function(k){
            return laps[k];
          }).value();
          this._winner = Crafty.keyNames[winner].replace( '_', ' ' );

          setTimeout( function() {
            self.reset();
            Crafty.scene('main');
          }, 5000 );
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
      planet.x    = center_in_x( planet.w );
      planet.y    = center_in_y( planet.h );
      planet.bind('EnterFrame', function(){
        planet.x    = center_in_x( planet.w );
        planet.y    = center_in_y( planet.h );
      });
      this._planetSprite = planet;


      var planetText = Crafty.e( '2D, DOM, Text, planet-text' )
        .attr({
          w: planet.w
          ,h: planet.h / 2
        })
        .css({ 'font-size': (planet.h / 2).toString() + 'px' });
      planetText.x = center_in_x(planet.w);
      planetText.y = center_in_y(planet.h / 2);
      planetText.bind('EnterFrame', function(){
        planetText.x = center_in_x(planet.w);
        planetText.y = center_in_y(planet.h / 2);
      });
      planetText.text( GameConfig.planets[this.planet()].lapCount );
      this._planetText = planetText;
    }

    return this._planetSprite;
  }

  // method:: 'mouse', 'touch', 'key'
  // address:: null, coordinate pair, key code
  ,addPlayer: function( method, address ) {
    newEntity = Crafty.e( 'Unicycle' )
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
    switch ( this.state() ) {
      case 'attract':
      case 'countdown':
        if ( this.playerCount == 1 ) {
          this.state('attract');
        } else {
          this.state('countdown');
        }
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

  ,startCountdown: function() {
    switch ( this.state() ) {
      case 'attract':
      case 'countdown':
        if ( this.playerCount > 0 ) {
          this._countdownStart = new Date;
          Crafty.bind('EnterFrame', this.doCountdown );
        }
    }
  }

  ,stopCountdown: function() {
    this._countdownStart = null;
    Crafty.unbind( 'EnterFrame', this.doCountdown );
  }

  ,getCountdown: function() {
    if ( this._countdownStart == null ) return 0;

    var elapsed = Timer.now() - this._countdownStart;
    return Math.ceil( GameConfig.raceCountdownTime - elapsed / 1000 );
  }

  // Called on Enterframe, plays sounds & transitions from countdown to race
  ,doCountdown: function() {
    if ( StateManager.state() == 'countdown' ) {
      var curCount = StateManager.getCountdown();

      if ( curCount != StateManager._lastCount ) {
        var tone = curCount == 0 ? 'start_tone' : 'countdown_tone';
        window.juke.play( tone );
      }

      if ( curCount == 0 ) {
        StateManager.state( 'race' );
        StateManager.stopCountdown();
      }

      StateManager._lastCount = curCount;
    }
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
