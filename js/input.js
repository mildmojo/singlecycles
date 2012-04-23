function initInput() {
  inputLayer = Crafty.e( '2D, DOM, input-layer' )
    .attr({
      x: 0
      ,y: 0
      ,w: SCREEN_WIDTH
      ,h: SCREEN_HEIGHT
      ,z: Layer.INPUT
    })
    .bind( 'MouseDown', function(e){
      handleEvent( 'down', StateManager.mouseEntity );
    })
    .bind( 'MouseUp', function(e){
      handleEvent( 'up', StateManager.mouseEntity );
    })
    .bind( 'KeyDown', function(e){
      if ( isUsableKey( e.key ) ) {
        switch ( StateManager.state ) {
          case 'attract':
            StateManager.addPlayer( 'key', e.key );
          case 'countdown':
            StateManager.addPlayer( 'key', e.key );
          case 'race':
            handleEvent( 'down', StateManager.keyEntities[e.key] );
          case 'finish':
        }
        e.preventDefault();
      }
    })
    .bind( 'KeyUp', function(e){
      if ( isUsableKey( e.key ) ) {
        entity = StateManager.keyEntities[e.key];

        switch ( StateManager.state ) {
          case 'attract':
          case 'countdown':
            // Key released before race start; remove player and restart timer
            StateManager.removePlayer( 'key', e.key );
          case 'race':
          case 'finish':
        }
        if ( StateManager.state == 'attract' ) {
          entity = StateManager.keyEntities[e.key];
          entity && entity.destroy();
        } else if ( StateManager )
        handleEvent( 'up', StateManager.keyEntities[e.key] );
        e.preventDefault();
      }
    });

  $(inputLayer._element)
    .bind( 'touchstart', function(e){
      // find touch-bound entity near coords and .go
    })
    .bind( 'touchend', function(e){
      // find touch-bound entity near coords and .stop
    });

  function handleEvent( state, entity ) {
    if ( entity ) {
      state == 'down' && entity.go();
      state == 'up'   && entity.stop();
    }
  }

  function isUsableKey( key ) {
    extendedKeys = _([ 'COMMA', 'MINUS', 'PERIOD', 'PLUS', 'TAB', 'CAPS',
      'MULTIPLY', 'ADD', 'SUBSTRACT', 'DECIMAL', 'DIVIDE', 'LEFT_ARROW',
      'RIGHT_ARROW', 'DOWN_ARROW', 'UP_ARROW', 'INSERT', 'DELETE', 'END',
      'HOME', 'ENTER', 'SPACE', 'SHIFT'
    ]).map( function(key) { return Crafty.keys[key]; } );

    extendedKeys.push( 61 );  // EQUALS
    extendedKeys.push( 192 ); // TILDE
    extendedKeys.push( 59 );  // SEMICOLON
    extendedKeys.push( 219 ); // LEFT_BRACKET
    extendedKeys.push( 221 ); // RIGHT_BRACKET
    extendedKeys.push( 220 ); // BACKSLASH
    extendedKeys.push( 191 ); // SLASH

    return ( key >= Crafty.keys['A'] && key <= Crafty.keys['Z'] )
      || ( key >= Crafty.keys['0'] && key <= Crafty.keys['9'] )
      || ( key >= Crafty.keys['NUMPAD_0'] && key <= Crafty.keys['NUMPAD_9'] )
      || _(extendedKeys).include(key);
  }
} // function initInput
