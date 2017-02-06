var game = new Phaser.Game(700, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
// LOAD PICS AND SPRITES
    // game.load.image('backdrop', 'assets/pics/Robota_UXO_by_Made_of_Bomb.jpg');
    game.load.image('background','assets/tests/debug-grid-1920x1920.png');

    game.load.image('ship', 'assets/games/asteroids/ship.png');
    game.load.image('bullet', 'assets/games/asteroids/bullets.png');

    // game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
} // END PRELOAD

// VARIABLES

var sprite; // ship
var cursors;

var bullet;
var bullets;
var bulletTime = 0;



// ========================== CREATE ================================== 


function create() {

// SETUP
// ====================================================
//  This will run in Canvas mode, so let's gain a little speed and display
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

//  ADD ARCADE PHYSICS
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);

// WORLD
// ====================================================
//  BACKGROUND
    // game.add.sprite(3000, 3000, 'backdrop');
    game.add.tileSprite(0, 0, 4000, 4000, 'background');
//  WORLD BOUNDARIES
    game.world.setBounds(0, 0, 4000, 4000);

    // DEADZONE
    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'ship'); 
    game.physics.p2.enable(sprite);


// SCOREBOARD
// ====================================================
    var t = game.add.text(0, 0, "Kills: ", { font: "14px Serif", fill: "#ffffff", align: "center" });
    t.fixedToCamera = true;
    t.cameraOffset.setTo(750, 32);



// MAIN CHARACTER
// ====================================================
//  PLAYER SHIP
//  STARTING POINT
    sprite = game.add.sprite(300, 300, 'ship');
    sprite.anchor.set(0.5);

//  ADD PHYSICS TO SHIP 
    game.physics.enable(sprite, Phaser.Physics.ARCADE);


// CAMERA
// ====================================================
// CAMERA FOLLOWS SPRITE
    game.camera.follow(sprite);
// DEADZONE
    // game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400);


// SPEED
// ====================================================

//  SHIP SPEED 
    sprite.body.maxVelocity.set(275);

//  DRAG TO SLOW DOWN FROM MAX SPEED (SHIP WEIGHT)
    sprite.body.drag.set(800);


// RANDOM CHARACTERS
// ====================================================
    // for (var i = 0; i < 10; i++)
    //     {game.add.sprite(game.world.randomX, game.world.randomY, 'sonic');}


// WEAPONS
// ====================================================

//  BULLETS SETUP
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

//  NUMBER OF BULLETS BEFORE RELOAD
    bullets.createMultiple(180, 'bullet');
    // bullets.setAll('anchor.x', 0.5);
    // bullets.setAll('anchor.y', 0.5);


// KEYBOARD
// ====================================================

//  KEYBOARD
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
} // END CREATE



// ========================== UPDATE ================================== 

function update() {

// KEYBOARD
// ====================================================


//  UP, ACCELERATION-SPEED
    if (cursors.up.isDown)
    {game.physics.arcade.accelerationFromRotation(sprite.rotation, 2000, sprite.body.acceleration);}
// DOWN, ACCELERATION-SPEED
    else if (cursors.down.isDown)
    {game.physics.arcade.accelerationFromRotation(sprite.rotation, -2000, sprite.body.acceleration);}
// OTHERWISE STOP
    else{sprite.body.acceleration.set(0);}


// LEFT + UP OR DOWN, ROTATE SPEED LEFT
    if (cursors.left.isDown && cursors.up.isDown || cursors.left.isDown && cursors.down.isDown) {sprite.body.angularVelocity = -140;}
// RIGHT + UP OR DOWN, ROTATE SPEED RIGHT
    else if (cursors.right.isDown && cursors.up.isDown || cursors.right.isDown && cursors.down.isDown) {sprite.body.angularVelocity = 140;}


// ROTATION WHILE STANDING
// ROTATE LEFT
    else if(cursors.left.isDown) {sprite.body.angularVelocity = -150;}
// ROTATE RIGHT 
    else if(cursors.right.isDown) {sprite.body.angularVelocity = 150;}
// NONE
    else{sprite.body.angularVelocity = 0;}

// SPACEBAR TO SHOOT
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {fireBullet();}


// BOOST - IF R IS DOWN
    if(game.input.keyboard.isDown(Phaser.Keyboard.R)){
        sprite.body.maxVelocity.set(500);
    }
    else{sprite.body.maxVelocity.set(275)};

} // END UPDATE




function fireBullet () {

// WEAPONS
// ====================================================
    if (game.time.now > bulletTime)
    {bullet = bullets.getFirstExists(false);

    if (bullet)
//  BULLET START POSITION ON SPRITE
    {bullet.reset(sprite.body.x + 14, sprite.body.y + 12);
//  BULLET LIFESPAN
    bullet.lifespan = 3000;
    bullet.rotation = sprite.rotation;

// BULLET SPEED OF TRAVEL - SPRITE = (250)
    // IF BOOST - R
    if(game.input.keyboard.isDown(Phaser.Keyboard.R)){
    game.physics.arcade.velocityFromRotation(sprite.rotation, 2000, bullet.body.velocity);}
    // OTHERWISE
    else{game.physics.arcade.velocityFromRotation(sprite.rotation, 1000, bullet.body.velocity);}

// DISTANCE BETWEEN BULLETS
    bulletTime = game.time.now + 0;}}
} // END FIREBULLET()



function render() {
//  SHOW CAMERA COORDINATES
    // game.debug.cameraInfo(game.camera, 32, 32);
//  SHOW SPRITE COORDINATES
    // game.debug.spriteCoords(sprite, 350, 32);
// DEADZONE - Rectangle that defines the limits at which the camera will scroll
    
    // var zone = game.camera.deadzone;

    // game.context.fillStyle = 'rgba(255,0,0,0.6)';
    // game.context.fillRect(zone.x, zone.y, zone.width, zone.height);

} // END RENDER
































