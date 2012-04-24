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
    Crafty.unbind( 'EnterFrame', jukeLoop );
    Crafty.bind( 'EnterFrame', jukeLoop );
    Crafty.unbind( 'EnterFrame', Timer.tick );
    Crafty.bind( 'EnterFrame', Timer.tick );


    StateManager.bannerText = Crafty.e( '2D, DOM, Text, countdown-text' )
      .attr({
        x: 0,
        y: SCREEN_HEIGHT / 12,
        z: Layer.HUD_BG,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT / 8,
        visible: false
      })
      .css({ 'font-size': SCREEN_HEIGHT / 8 });

    Crafty.unbind( 'EnterFrame', showBannerText );
    Crafty.bind( 'EnterFrame', showBannerText );

    // Allow players to join the next race
    StateManager.state('attract');

  });

});

function jukeLoop(frame) {
  frame % 2 && jukebox.Manager.loop();
}

function showBannerText() {
  countdown = StateManager.bannerText;

  switch ( StateManager.state() ) {
    case 'attract':
      countdown.visible = true;
      countdown.text( 'Everyone hold a key to join the race!' );
      break;
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
      countdown.text( 'Winner: ' + StateManager.getWinner() );
      countdown.visible = true;
      $(countdown._element).show();
      break;
    default:
      countdown.visible = false;
  }
}
