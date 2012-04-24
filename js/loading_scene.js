$(function(){

  Crafty.scene('loading', function(){
    Crafty.background( '#333' );

    height = SCREEN_HEIGHT / 7;
    msg = Crafty.e( '2D, DOM, Text, loading-text' )
      .text( 'Circumnavigating, please wait...' )
      .attr({ w: SCREEN_WIDTH, h: height, z: Layer.HUD_BG })
      .css({ 'font-size': height.toString() + 'px' });

    msg.x = center_in_x(msg.width);
    msg.y = -msg.height - 10;

    $(msg._element).animate({ top: center_in_y( msg.h ) });

    height = SCREEN_HEIGHT / 10;
    progress = Crafty.e( '2D, DOM, Text, loading-text' )
      .attr({ w: SCREEN_WIDTH, h: height, z: Layer.HUD_BG })
      .css({ 'font-size': height.toString() + 'px' });

    progress.x = center_in_x(progress.width)
    progress.y = SCREEN_HEIGHT + 10;

    $(progress._element).animate({ top: SCREEN_HEIGHT * 0.7 });

    var assets = [
      'assets/images/unicycles.png'
      ,'assets/images/worlds.png'
      ,'assets/images/starfield.png'
    ]

    Crafty.load(assets,
      // On complete
      function(){
        msg.text('Tightening spokes, adjusting seats...');
        msg.x = center_in_x(msg.width);

        initSounds();
        initSprites();

        var fader = Crafty.e( '2D, DOM' )
          .attr({ x: 0, y: 0, w: SCREEN_WIDTH, h: SCREEN_HEIGHT, z: 100, alpha: 0 })
          .css({ 'background-color': 'black' });

        fadeToBlack( 1000 );
        $(fader._element)
          .delay( 1100 )
          .queue( function(){ Crafty.scene('main'); } );
      },
      // On progress
      function(e){
        progress.text( e.percent.toString() + '%' );
      });

  });


  function initSounds() {
    // Set up to call jukebox.Manager.loop() instead of using builtin
    jukebox.Manager.useGameLoop = true;

    window.juke = new jukebox.Player({
      resources: [
        'assets/sounds/spritesheet.ac3'
        ,'assets/sounds/spritesheet.mp3'
        ,'assets/sounds/spritesheet.m4a'
        ,'assets/sounds/spritesheet.ogg'
        ,'assets/sounds/spritesheet.amr'
      ],

      spritemap: {
        click: {
          start: 0.00,
          end: 0.29,
          //loop: true
        }
        ,countdown_tone: {
          start: 2.00,
          end: 2.33
        }
        ,start_tone: {
          start: 4.00,
          end: 4.56
        }
        ,liftoff: {
          start: 6.00,
          end: 6.76
        }
        ,lap_ding: {
          start: 8.00,
          end: 8.75
        }
        ,bubble: {
          start: 10.00,
          end: 10.37
        }
        ,crowd_noise: {
          start: 12.00,
          end: 17.18
        }
      } //,

      //autoplay: 'bgmusic',

    });
  }

  function initSprites() {
    Crafty.sprite(48, 'assets/images/unicycles.png', {
      unicycle_fast:    [1, 0]
      ,unicycle_normal: [0, 0]
      ,unicycle_slow:   [2, 0]
    });

    Crafty.sprite(160, 'assets/images/worlds.png', {
      world_fire:     [0, 0]
      ,world_jungle:  [1, 0]
      ,world_rock:    [2, 0]
    });
  }

});