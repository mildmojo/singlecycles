$(function(){
  Crafty.scene('main', function(){
    fadeFromBlack( 1000 );

    Crafty.background( '#222' );

    initInput();

    StateManager.state('init');

    speeds = [ 'fast', 'normal', 'slow' ];
    worlds = [ 'fire', 'jungle', 'rock' ];

    // for ( var i = 0; i < 3; i++ ) {
    //   Crafty.e( '2D, Canvas, Mouse, unicycle_' + speeds[i] )
    //     .attr({ x: i * 48 + 16, y: 16 })
    //     .bind('Click', function(){  });
    //   Crafty.e( '2D, Canvas, world_' + worlds[i] )
    //     .attr({ x: i * 160 + 16, y: 80 });
    // }

    // Hook up per-frame update events
    Crafty.bind('enterframe', jukebox.Manager.loop );
    Crafty.bind('enterframe', Timer.tick )

    planet = Crafty.e( '2D, Canvas, Tween, world_fire' );
    planet.x = center_in_x( planet.w );
    planet.y = center_in_y( planet.h );

    // Allow players to join the next race
    StateManager.state('attract');

  });
});

