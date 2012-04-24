$(function(){

  Crafty.scene('main', function(){
    fadeFromBlack( 1000 );

    Crafty.background( '#222' );

    initInput();

    StateManager.state('init');
    StateManager.cycle('normal');
    StateManager.planet('fire');
    StateManager.planetSprite(); // create

    // Hook up per-frame update events
    Crafty.bind('EnterFrame', function(frame){ frame % 2 && jukebox.Manager.loop(); } );
    Crafty.bind('EnterFrame', Timer.tick )


    var countdown = Crafty.e( '2D, DOM, Text, countdown-text' )
      .attr({
        x: 0,
        y: SCREEN_HEIGHT / 12,
        z: Layer.HUD_BG,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT / 8,
        visible: false
      })
      .css({ 'font-size': SCREEN_HEIGHT / 8 });

    Crafty.bind( 'EnterFrame', function() {
      switch ( StateManager.state() ) {
        case 'attract':
          countdown.visible = true;
          countdown.text( 'Hold keys to join the race!' );
        case 'countdown':
          countdown.visible = true;
          countdownNumber = StateManager.getCountdown();
          countdown.text( 'Race starts in ' + countdownNumber.toString() + '...' );
          //this._lastCountdown = countdownNumber;
          break;
        case 'race':
          if ( $(countdown._element).queue().length == 0 && countdown.visible ) {
            countdown.text( 'GO!!' );
            $(countdown._element)
              .delay( 1000 )
              .fadeOut( 1000 )
              .queue( function() { countdown.visible = false; });
          }
          break;
        case 'finish':
          countdown.visible = true;
          countdown.text( 'Winner: ' );
          $(countdown._element).delay(500).queue( function(){
            countdown.text( 'Winner: ' + StateManager.getWinner() );
          });
        default:
          countdown.visible = false;
      }
    });

    // Allow players to join the next race
    StateManager.state('attract');

  });

});

