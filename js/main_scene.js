$(function(){

  Crafty.scene('main', function(){
    fadeFromBlack( 1000 );

    Crafty.background( '#222' );

    initInput();

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
        h: SCREEN_HEIGHT / 10,
        visible: false
      })
      .css({ 'font-size': SCREEN_HEIGHT / 10 });

    Crafty.unbind( 'EnterFrame', showBannerText );
    Crafty.bind( 'EnterFrame', showBannerText );

    var bylineText = Crafty.e( '2D, DOM, Text, byline-text' )
      .attr({
        x: 0
        ,z: Layer.LINKS
        ,w: SCREEN_WIDTH
        ,h: SCREEN_HEIGHT / 4
      })
      .css({ 'font-size': (SCREEN_HEIGHT / 25).toString() + 'px' });
    bylineText.y = SCREEN_HEIGHT * 0.75;
    bylineText.bind('EnterFrame', function(){
      if ( Math.abs( bylineText.y - SCREEN_HEIGHT * 0.75 ) > 3 ) {
        bylineText.y = SCREEN_HEIGHT * 0.80;
      }
    });
    bylineText.text(
      '<p>'
      + '<span class="smallcaps">Single Cycles, a game for many'
      + ' players by <a href="http://twitter.com/mildmojo">@mildmojo</a>.'
      + '</span></p><p><span class="smallcaps">'
      + 'Submitted for Ludum Dare 23, a 48-hour game dev challenge. Send'
      + ' feedback on Twitter or at the'
      + ' <a href="http://www.ludumdare.com'
      + '/compo/ludum-dare-23/?action=preview&uid=6748">'
      + 'competition entry page</a>.'
      + '</span></p>');
    StateManager.bylineText = bylineText;

    // Make mobile address bar disappear?
    $('body').css({ height: SCREEN_HEIGHT * 2 });
    window.scrollTo(0,1);

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
      $(StateManager.bylineText._element).fadeOut( 2000 );
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
