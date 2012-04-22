var SCREEN_WIDTH;
var SCREEN_HEIGHT;

$(function(){

  // FULL SCREEN LIKE A BOSS
  Crafty.init();

  // Monitor browser resize events, like mobile orientation changes
  $.resize(function(){
    SCREEN_WIDTH  = Crafty.DOM.window.width;
    SCREEN_HEIGHT = Crafty.DOM.window.height;
  });


  Crafty.scene('loading', function(){
    Crafty.background( '#333' );

    msg = Crafty.e( '2D, DOM, Text, loading-text' )
      .text( 'Circumnavigating, please wait...' )
      .css({ size: SCREEN_HEIGHT / 5 });

    msg.attr({ x: center_in_x(msg.width), y: -msg.height - 10 });

    $(msg._element).animate({ top: center_in_y( msg.height ) });

    var assets = [
      'assets/images/unicycles.png'
      ,'assets/images/worlds.png'
      ,'assets/images/starfield.png'
      ,'assets/sounds/soundsheet.'
    ]

    Crafty.load(assets, function(){
      init_sprites();

      Crafty.scene('main');
    })

  });

  Crafty.scene('main', function(){


  });

  
  function init_sprites() {


  }

  Crafty.scene('loading');

});