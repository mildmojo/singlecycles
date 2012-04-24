// helpers.js

var DEG_TO_RAD = ( 2.0 * Math.PI ) / 360;
var RAD_TO_DEG = 360 / ( 2.0 * Math.PI );

var GameConfig = {
  raceCountdownTime: 3
  ,cycles: {
    slow:     { accelFactor: 5, mass: 10, maxVelocity: 9 }
    ,normal:  { accelFactor: 10, mass: 7,  maxVelocity: 10 }
    ,fast:    { accelFactor: 15, mass: 4,  maxVelocity: 11 }
  }
  ,planets: {
    fire:     { gravity: 1, radius: 80, friction: 6, lapCount: 10 }
    ,jungle:  { gravity: 1, radius: 80, friction: 6, lapCount: 15 }
    ,rock:    { gravity: 1, radius: 80, friction: 6, lapCount: 20 }
  }
};

var Layer = {
  INPUT:    12
  ,HUD_FG:  10
  ,HUD_BG:  9
  ,EFFECTS: 7
  ,SPRITES: 5
  ,BG:      0
};

var PlayerColors = [
  '#EE0000'  // red
  ,'#00EE00' // green
  ,'#0000EE' // blue
  ,'#800080' // purple
  ,'#FFA500' // orange
  ,'#008000' // dark green
  ,'#ADD8E6' // light blue
  ,'#808080' // grey
  ,'#800000' // dark red
  ,'#FFFFFF' // white
]

function center_in_x(val) {
  return origin().x - val / 2;
}

function center_in_y(val) {
  return origin().y - val / 2;
}

function origin() {
  return { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 };
}

function clampVal( val, min, max ) {
  val < min && (val = min);
  val > max && (val = max);
  return val;
}

// Fade to black over duration millisecs
function fadeToBlack( duration ) {
  _doFadeBlack( 0.0, 1.0, duration );
}

// Fade from black to clear over duration millisecs
function fadeFromBlack( duration ) {
  _doFadeBlack( 1.0, 0.0, duration );
}

// Fade a black layer from startAlpha to endAlpha over duration millisecs
function _doFadeBlack( startAlpha, endAlpha, duration ) {
  return Crafty.e("2D, DOM, Box, Tween, Color")
    .attr({
      x: 0,
      y: 0,
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
      z: Layer.HUD_FG,
      alpha: startAlpha
    })
    .color( 'black' )
    .tween({ alpha: endAlpha }, ( duration / 1000 ) * Crafty.timer.getFPS() );
}

// Gets called by Crafty's EnterFrame event, so needs to refer to
//   'Timer' instead of 'this'
var Timer = {
  _lastTick:  null
  ,dt:        0

  ,tick: function() {
    now = new Date;

    if ( Timer._lastTick == null ) Timer._lastTick = now;

    Timer.dt = (now - Timer._lastTick) / 1000;
    Timer._lastTick = now;
  }

  ,now: function() { return new Date; }
}

