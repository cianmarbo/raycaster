const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH  = TILE_SIZE * MAP_NUM_COLS;
const WINDOW_HEIGHT = TILE_SIZE * MAP_NUM_ROWS;

const FOV_ANGLE = 60 * (Math.PI / 180); //field of view angle

const WALL_STRIP_WIDTH = 4; // thicker walls
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

const RAYLINE_LENGTH = 30;

let DEBUG_MODE = false;

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
        this.x = WINDOW_WIDTH / 2; //400
        this.y = WINDOW_HEIGHT / 2; //300
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
        /*
        this.x = this.x + Math.cos(this.rotationAngle) * moveStep;
        this.y = this.y + Math.sin(this.rotationAngle) * moveStep;
        */

        var newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;

        if(!grid.checkCollision(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }

    }

    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius);
        stroke("red");

        if(DEBUG_MODE) {
            line(this.x,
                this.y, 
                this.x + Math.cos(this.rotationAngle) * RAYLINE_LENGTH, //when 92 degrees = 398.953 //when 90 degrees = 400
                this.y + Math.sin(this.rotationAngle) * RAYLINE_LENGTH //when 92 degrees = 329.981 //when 90 degrees = 330
           );
   
           noFill();
           circle(this.x, this.y, 30);
        }
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = rayAngle;
    }
    render() {
        stroke("rgba(255, 0, 0, 0.2)");
        line(
            player.x,
            player.y,
            player.x + Math.cos(this.rayAngle) * RAYLINE_LENGTH,
            player.y + Math.sin(this.rayAngle) * RAYLINE_LENGTH
        );
    }
}

var grid = new Map();
var player = new Player();
var rays = []

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

    rays = [];

    for(var i = 0; i < NUM_RAYS; i++) {
        var ray = new Ray(rayAngle);
        //rays.cast();...
        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;

        columnId++;
    }
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
