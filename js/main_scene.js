$(function(){
  Crafty.scene('main', function(){
    fadeFromBlack( 1000 );

    Crafty.background( '#222' );

    initInput();

    StateManager.state('init');
    StateManager.cycle('normal');
    StateManager.planet('fire');

    // Hook up per-frame update events
    Crafty.bind('enterframe', jukebox.Manager.loop );
    Crafty.bind('enterframe', Timer.tick )

    var planet  = Crafty.e( '2D, Canvas, Tween, world_' + StateManager.planet() );
    planet.x    = center_in_x( planet.w );
    planet.y    = center_in_y( planet.h );

    var countdown = Crafty.e( '2D, DOM, Text, countdown-text' )
      .attr({ x: 0, y: SCREEN_HEIGHT / 12, z: Layer.HUD_BG, visible: false })
      .css({ 'font-size': SCREEN_HEIGHT / 8 });

    Crafty.bind( 'Enterframe', function() {
      if ( StateManager.state() == 'countdown' ) {
        countdownNumber = StateManager.getCountdown();
        countdown.visible( true );

        if ( countdownNumber == 0 ) {
          countdown.text( 'GO!!' );
          $(countdown._element)
            .delay( 1000 )
            .slideOut( 1000 )
            .queue( function() { countdown.visible( false )});
        } else {
          countdown.text( 'Race starts in ' + countdownNumber.toString + '...' );
        }

        this._lastCountdown = countdownNumber;
      } else {
        countdown.visible( false );
      }
    });

    // Allow players to join the next race
    StateManager.state('attract');

  });
});

