var MainSceneBinds = {
  init: function() {
    // Hook up per-frame update events
    Crafty.bind( 'EnterFrame', jukeLoop );
    Crafty.bind( 'EnterFrame', Timer.tick );

    // Handle banner text transitions
    Crafty.bind( 'enter-attract', showAttractBanner );
    Crafty.bind( 'enter-countdown', showCountdownBanner );
    Crafty.bind( 'enter-race', showRaceBanner );
    Crafty.bind( 'enter-finish', showFinishBanner );
    Crafty.bind( 'CountdownTick', updateCountdownBanner );

    Crafty.bind( 'WindowResize', alignBylineText );
    Crafty.bind( 'WindowResize', alignBanner );
  }
}

$(function(){

  Crafty.scene('main', function(){
    fadeFromBlack( 1000 );

    Crafty.background( '#222' );

    initInput();

    StateManager.planetSprite(); // create

    StateManager.bannerText = Crafty.e( '2D, DOM, Text, countdown-text' )
      .attr({
        x: 0,
        z: Layer.HUD_BG,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT / 10,
        visible: false
      })
      .css({ 'font-size': SCREEN_HEIGHT / 10 });

    var bylineText = Crafty.e( '2D, DOM, Text, byline-text' )
      .attr({
        x: 0
        ,z: Layer.LINKS
        ,w: SCREEN_WIDTH
        ,h: SCREEN_HEIGHT / 4
      })
      .css({ 'font-size': (SCREEN_HEIGHT / 25).toString() + 'px' });

    bylineText.visible = false;
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
    alignBylineText();
    StateManager.bylineText.visible = true;

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

function showAttractBanner() {
  var countdown = StateManager.bannerText;
  countdown.visible = true;
  countdown.text( 'Everyone hold a key to join the race!' );
}

function showCountdownBanner() {
  var countdown       = StateManager.bannerText;
  $(StateManager.bylineText._element).fadeOut( 2000 );
  countdown.visible = true;
}

function updateCountdownBanner(count) {
  var countdown       = StateManager.bannerText;
  var countdownNumber = count;
  countdown.text( 'Race starts in ' + countdownNumber.toString() + '...' );
}

function showRaceBanner() {
  var countdown = StateManager.bannerText;
  if ( $(countdown._element).queue().length == 0 && countdown.visible ) {
    countdown.text( 'GO!!' );
    $(countdown._element)
      .delay( 1000 )
      .fadeOut( 1000 )
      .queue( function() { countdown.visible = false; });
  }
}

function showFinishBanner() {
  var countdown = StateManager.bannerText;
  countdown.text( 'Winner: ' + StateManager.getWinner() );
  countdown.visible = true;
  $(countdown._element).show();
}

function hideBanner() {
  StateManager.bannerText.visible = false;
}

function alignBanner() {
  var bannerText = StateManager.bannerText;

  if ( Math.abs( bannerText.y - SCREEN_HEIGHT / 12 ) > 3 ) {
    bannerText.y = SCREEN_HEIGHT / 12;
  }

  if ( Math.abs( bannerText.w - SCREEN_WIDTH ) > 3 ) {
    bannerText.w = SCREEN_WIDTH;
  }
}

function alignBylineText() {
  var bylineText = StateManager.bylineText;

  if ( Math.abs( bylineText.y - SCREEN_HEIGHT * 0.75 ) > 3 ) {
    bylineText.y = SCREEN_HEIGHT * 0.80;
  }

  if ( Math.abs( bylineText.w - SCREEN_WIDTH ) > 3 ) {
    bylineText.w = SCREEN_WIDTH;
  }
}