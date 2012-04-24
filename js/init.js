var SCREEN_WIDTH;
var SCREEN_HEIGHT;

$(function(){

  // FULL SCREEN LIKE A BOSS
  Crafty.init();

  SCREEN_WIDTH  = Crafty.DOM.window.width;
  SCREEN_HEIGHT = Crafty.DOM.window.height;

  // Monitor browser resize events, like mobile orientation changes
  $(window).resize(function(){
    SCREEN_WIDTH  = Crafty.DOM.window.width;
    SCREEN_HEIGHT = Crafty.DOM.window.height;
  });

  Crafty.scene('loading');

});
