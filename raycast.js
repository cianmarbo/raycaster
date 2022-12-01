const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH  = TILE_SIZE * MAP_NUM_COLS;
const WINDOW_HEIGHT = TILE_SIZE * MAP_NUM_ROWS;

const FOV_ANGLE = 60 * (Math.PI / 180); //field of view angle

const WALL_STRIP_WIDTH = 100; // thicker walls
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

const RAYLINE_LENGTH = 30;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }

    render() {
        for(var y = 0; y < MAP_NUM_ROWS; y++) {
            for(var x = 0; x < MAP_NUM_COLS; x++) {
                var tilePosX = x * TILE_SIZE;
                var tilePosY = y * TILE_SIZE;

                var color = this.grid[y][x] == 1 ? "#ff4598" : "#fff";
                stroke("#222");
                fill(color);

                rect(tilePosX, tilePosY, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    checkCollision(xpos, ypos) {

        if((xpos < 0 || xpos > WINDOW_WIDTH) || (ypos < 0 || ypos > WINDOW_HEIGHT)) {
            return true;
        }

        xpos = Math.floor(xpos / TILE_SIZE); //Math.floor will round down float to nearest integer
        ypos = Math.floor(ypos / TILE_SIZE);

        if(this.grid[ypos][xpos] == 1) {
            return true;
        }

        return false;
    }
}

class Player {
    constructor() {
        this.xpos = WINDOW_WIDTH / 2; //400
        this.ypos = WINDOW_HEIGHT / 2; //300
        this.radius = 3;
        
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if backwards, +1 if forewards

        this.rotationAngle = Math.PI / 2; // (90 degrees)
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180);
    }

    update() {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        var moveStep = this.walkDirection * this.moveSpeed;
        
        // this.x = this.x + Math.cos(this.rotationAngle) * moveStep;
        // this.y = this.y + Math.sin(this.rotationAngle) * moveStep;

        var newPlayerX = this.xpos + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.ypos + Math.sin(this.rotationAngle) * moveStep;


        if(!grid.checkCollision(newPlayerX, newPlayerY)) {
            this.xpos = newPlayerX;
            this.ypos = newPlayerY;
        }

    }

    render() {
        noStroke();
        fill("red");
        circle(this.xpos, this.ypos, this.radius);

        // stroke("red");
        // line(
        //     this.xpos,
        //     this.ypos, 
        //     this.xpos + Math.cos(this.rotationAngle) * RAYLINE_LENGTH, //when 92 degrees = 398.953 //when 90 degrees = 400
        //     this.ypos+ Math.sin(this.rotationAngle) * RAYLINE_LENGTH //when 92 degrees = 329.981 //when 90 degrees = 330
        //     );
   
        // noFill();
        // circle(this.x, this.y, 30);
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle);
        
        //keep track of x, y position which intersected with a wall
        this.wallHitX = 0;
        this.wallHitY = 0;

        //distance between player and wall intersection
        this.distance = 0;

        //ray is facing down if angle is greater than 0 degrees and less than 180 degrees
        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;

        //ray is facing right if angle is less than half of 180 degrees (90 degrees) or its greater than 270 degrees (1.5 * pi)
        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    }
    cast(columnId) {
        var xintercept, yintercept;
        var xstep, ystep;

        /////////////////////////////////////////////////
        // HORIZONTAL RAY-GRID INTERSECTION CODE
        ////////////////////////////////////////////////

        console.log("isRayFacingRight?", this.isRayFacingRight);

        // Find y-cord of closest horizontal grid intersection
        yintercept = Math.floor(player.ypos / TILE_SIZE) * TILE_SIZE;

        // Check if angle is facing down, if so add TILE_SIZE (32) to original yintercept, else add nothing (0)
        yintercept += this.isRayFacingDown ? TILE_SIZE : 0;

        // Alternatively, divide player.ypos by TILE_SIZE, get modulo and add to player.ypos
        // Just a thought...

        // Find x-cord of closest horizontal grid intersection
        // xintercept = player.xpos + ((player.ypos - yintercept) / Math.tan(rayAngle));

        xintercept = player.xpos + ((yintercept - player.ypos) / Math.tan(this.rayAngle));

        // Calculate the increment for xstep and ystep
        ystep = TILE_SIZE;

        //if ray is facing up, subtract 32 from ystep, if facing down, add 32
        ystep *= this.isRayFacingUp ? -1 : 1;

        xstep = TILE_SIZE / Math.tan(this.rayAngle);

        //if result of xstep is positive, but angle is left, set xstep to be negative
        xstep *= (this.isRayFacingLeft && xstep > 0) ? -1 : 1;

        //if result of xstep is negative, but angle is right, set xstep to be positive
        xstep *= (this.isRayFacingRight && xstep <  0) ? -1 : 1;


    }
    render() {
        stroke("rgba(255, 0, 0, 0.2)");
        line(
            player.xpos,
            player.ypos,
            player.xpos + Math.cos(this.rayAngle) * RAYLINE_LENGTH,
            player.ypos + Math.sin(this.rayAngle) * RAYLINE_LENGTH
        );
    }
}

var grid = new Map();
var player = new Player();
var rays = [];

function keyPressed() {
    // keyPressed() is called from p5.js

    if(keyCode == UP_ARROW) {
        player.walkDirection = 1;
    } else if (keyCode == DOWN_ARROW) {
        player.walkDirection = -1;
    } else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = 1;
    } else if (keyCode == LEFT_ARROW) {
        player.turnDirection = -1;
    }
}

function keyReleased() {
    //keyReleased() is called from p5.js
    if(keyCode == UP_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == DOWN_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = 0;
    } else if (keyCode == LEFT_ARROW) {
        player.turnDirection = 0;
    }
}

function castAllRays() {
    var columnId = 0;

    //get the left most (first ray), by subbing 30 degrees
    var rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

    rays = []; //initialize ray array 

    for(var i = 0; i < 1; i++) {

        //console.log(columnId);

        var ray = new Ray(rayAngle);
        ray.cast(columnId);
        
        rays.push(ray);

        //what will go into FOV_ANGLE (60 degrees) NUM_RAYS (5) times
        rayAngle += FOV_ANGLE / NUM_RAYS;

        columnId++;
    }
}

//sanitize angle
function normalizeAngle(angle) {

    //angle will overflow and start at 0 again once over 360 degress (2 pi radians)
    angle = angle % (2 * Math.PI);
    
    /*if angle is -1 degrees, make it 359 degress by forcing angle 
    to 360 degrees and "adding" minus angle, resulting in a 
    subtraction by 1 to 359 degrees
    */

    if(angle < 0) {
        angle = (2 * Math.PI) + angle;
    }

    return angle;
}

function setup() {
    // TODO: initialize all objects
    // setup() is called from p5.js

    //createCanvas is a p5.js function that draws a canvas
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    // TODO: update all game objects before we render the next frame

    player.update();
    castAllRays();
}

function draw() {
    // TODO: render all objects frame by frame
    // draw() is called from p5.js

    update();

    grid.render();
    player.render();
    
    for(ray of rays) {
        ray.render();
    }
}
