// helpers.js

var GameConfig = {
  raceCountdownTime: 3
  ,cycles: {
    slow:     { accelFactor: 0.2, mass: 10 }
    ,normal:  { accelFactor: 0.3, mass: 7 }
    ,fast:    { accelFactor: 0.4, mass: 4 }
  }
  ,planets: {
    fire:     { gravity: 5, radius: 80, friction: 0.1 }
    ,jungle:  { gravity: 5, radius: 80, friction: 0.1 }
    ,rock:    { gravity: 5, radius: 80, friction: 0.1 }
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

var Timer = {
  _lastTick:  null
  ,dt:        0

  ,tick: function() {
    now = new Date;

    if ( this._lastTick == null ) this._lastTick = now;

    this.dt = now - this._lastTick;
    this._lastTick = now;
  }

  ,now: function() { return new Date; }
}

