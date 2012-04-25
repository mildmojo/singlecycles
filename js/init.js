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

  // Add some unsupported keycodes to Crafty.keys
  extendKeys();

  Crafty.scene('loading');

});


// Add some unsupported keycodes to Crafty.keys
function extendKeys(){
  jQuery.extend( Crafty.keys, {
    EQUALS:         61
    ,TILDE:         192
    ,SEMICOLON:     59
    ,LEFT_BRACKET:  219
    ,RIGHT_BRACKET: 221
    ,BACKSLASH:     220
    ,SLASH:         191
  });
}