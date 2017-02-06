var game = new Phaser.Game(900, 700, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
// LOAD PICS AND SPRITES
    game.load.image('stars', 'assets/misc/starfield.jpg');

    // game.load.image('ship', 'assets/sprites/thrust_ship.png');
    game.load.image('ship', 'assets/sprites/thrust_ship2.png');
    // game.load.image('ship', 'assets/sprites/xenon2_ship.png');
    // game.load.image('ship', 'assets/sprites/ship.png');
    // game.load.image('ship', 'assets/sprites/player.png');
    // game.load.image('ship', 'assets/sprites/plane.png');
    // game.load.image('ship', 'assets/sprites/advanced_wars_tank.png');
    // game.load.image('ship', 'assets/sprites/car90.png');
    // game.load.image('ship', 'assets/sprites/tinycar.png');

    game.load.image('bullet', 'assets/bullets/bullets.png');
    // game.load.image('bullet', 'assets/bullets/bullet.png');

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

//  ADD ARCADE PHYSICS AND PS PHYSICS
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 0.9;

// WORLD
// ====================================================
//  BACKGROUND PIC
    // game.add.sprite(3000, 3000, 'backdrop');
    // game.add.tileSprite(0, 0, 4000, 4000, 'background');
//  WORLD BOUNDARIES
    game.world.setBounds(0, 0, 4000, 4000);

    starfield = game.add.tileSprite(0, 0, 900, 700, 'stars');
    starfield.fixedToCamera = true;


//  The bounds of our physics simulation
    var bounds = new Phaser.Rectangle(0, 0, 4000, 4000);
//  Just to display the bounds
    var graphics = game.add.graphics(bounds.x, bounds.y);
    graphics.lineStyle(135, 0xffd900, 1);
    graphics.drawRect(0, 0, bounds.width, bounds.height);


// MAIN CHARACTER
// ====================================================
//  PLAYER SHIP
//  STARTING POINT
    // sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
    sprite = game.add.sprite(300, 350, 'ship');
    sprite.anchor.set(0.5);

//  ADD PHYSICS TO SHIP 
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    game.physics.p2.enable(sprite);

//  This boolean controls if the player should collide with the world bounds or not
    sprite.body.collideWorldBounds = true;


// CAMERA
// ====================================================
// CAMERA FOLLOWS SPRITE
    game.camera.follow(sprite);
// DEADZONE
    // game.camera.deadzone = new Phaser.Rectangle(200, 150, 500, 400);
    game.camera.deadzone = new Phaser.Rectangle(135, 110, 650, 500);



// SCOREBOARD
// ====================================================
    var t = game.add.text(0, 0, "Kills: ", { font: "14px Serif", fill: "#ffffff", align: "center" });
    t.fixedToCamera = true;
    t.cameraOffset.setTo(750, 32);



// SPEED
// ====================================================

//  SHIP SPEED 
    sprite.body.maxVelocity.set(150);

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
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);


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

//  UP-SPEED
    if (cursors.up.isDown)
    {game.physics.arcade.accelerationFromRotation(sprite.rotation, 2000, sprite.body.acceleration);} 
// DOWN--SPEED
    else if (cursors.down.isDown)
    {game.physics.arcade.accelerationFromRotation(sprite.rotation, -2000, sprite.body.acceleration);}
// OTHERWISE STOP
    else{sprite.body.acceleration.set(0);}


// LEFT + UP/DOWN ROTATATION SPEED
    if (cursors.left.isDown && cursors.up.isDown || cursors.left.isDown && cursors.down.isDown) {sprite.body.angularVelocity = -100;}
// RIGHT + UP/DOWN, ROTATATION SPEED
    else if (cursors.right.isDown && cursors.up.isDown || cursors.right.isDown && cursors.down.isDown) {sprite.body.angularVelocity = 100;}


// ROTATION WHILE STANDING
// ROTATE LEFT
    else if(cursors.left.isDown) {sprite.body.angularVelocity = -100;}
// ROTATE RIGHT 
    else if(cursors.right.isDown) {sprite.body.angularVelocity = 100;}
// NONE
    else{sprite.body.angularVelocity = 0;}


// BOOST
// ===================================================
// BOOST - IF R + UP/DOWN IS PRESSED
    if(game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.down.isDown)
        {sprite.body.maxVelocity.set(400);}
// BOOST - IF R + LEFT IS PRESSED
    else if(game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.left.isDown)
        {sprite.body.angularVelocity = -400;}
// BOOST - IF R + RIGHT IS PRESSED
    else if(game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.right.isDown)
        {sprite.body.angularVelocity = 400;}
    
    else{sprite.body.maxVelocity.set(150)};


// SPACEBAR TO SHOOT
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {fireBullet();}


// BACKGROUND IMAGE MOVE WITH CAMERA
    if (!game.camera.atLimit.x)
    {starfield.tilePosition.x -= ((sprite.body.velocity.x/16) * game.time.physicsElapsed);}

    if (!game.camera.atLimit.y)
    {starfield.tilePosition.y -= ((sprite.body.velocity.y/16) * game.time.physicsElapsed);}

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
    bullet.lifespan = 900;
    bullet.rotation = sprite.rotation;
// DISTANCE BETWEEN BULLETS
    bulletTime = game.time.now + 150;

// BULLET SPEED OF TRAVEL - SPRITE = (250)

// IF R + UP/DOWN
    if(game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.down.isDown)
        {game.physics.arcade.velocityFromRotation(sprite.rotation, 750, bullet.body.velocity);}

// IF STANDING AND R + LEFT/RIGHT
    else if(game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.R) && cursors.right.isDown)
        {game.physics.arcade.velocityFromRotation(sprite.rotation, 750, bullet.body.velocity);
            bulletTime = game.time.now + 40; bullet.lifespan = 100;}

    // OTHERWISE
    else{game.physics.arcade.velocityFromRotation(sprite.rotation, 500, bullet.body.velocity);
         bulletTime = game.time.now + 150;}

    }}
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
































