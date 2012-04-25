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
  extendCraftyKeys();

  // Add reverse lookup, keycode to key name
  addCraftyKeyNames();

  StateManager.state('init');
  StateManager.cycle('normal');
  StateManager.planet('fire');

  Crafty.scene('loading');

});


// Add some unsupported keycodes to Crafty.keys
function extendCraftyKeys(){
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

// Build reverse map of key code to key name
function addCraftyKeyNames() {
  Crafty.extend({ keyNames: {} });

  _.chain(Crafty.keys).keys().each( function(k){
    Crafty.keyNames[Crafty.keys[k]] = k;
  });
}