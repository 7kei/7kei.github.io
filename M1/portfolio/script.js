const perfectFrameTime = 1000 / 60;
var canvas;
var context;
let deltaTime = 0;
let lastTimestamp = 0;
let animationPaused = false;
let animationFrameId = null;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

let arrToDraw = [];

class Miku {
    constructor(context, x, y) {
        this.x = (typeof x === undefined) ? 0 : x;
        this.y = (typeof y === undefined) ? -100 : y;
        this.context = context;
        this.sprite = new Image();
        this.sprite.src = 'images/fallingmiku.png';
        this.toWalk = undefined;
        this.wait = 0;

        this.isStanding = false;

    }

    update() {
        this.context.drawImage(this.sprite, this.x, this.y);

        if (this.wait > 0) {
            this.sprite.src = 'images/standingmiku.png';
            this.wait--;
            if (this.y+100 > CANVAS_HEIGHT) this.y = CANVAS_HEIGHT-100;
            return;
        }

        if (this.y+100 < CANVAS_HEIGHT) {
            this.isFalling = true;
        }

        if (this.y+100 > CANVAS_HEIGHT && this.isFalling) {
            this.isStanding = true;
        }

        if (this.isStanding) {
            this.isFalling = false;
            this.sprite.src = 'images/standingmiku.png';
        }

        if (this.toWalk != 0) {
            if (this.y+100 > CANVAS_HEIGHT) this.y = CANVAS_HEIGHT-100;
            if (this.toWalk > this.x) {
                this.sprite.src = 'images/walkingmikuR.png';
                if (this.x-1 == this.toWalk) {
                    this.isStanding = true;
                    this.wait = 200;
                }

                this.x++;
            }
            if (this.toWalk < this.x) {
                this.sprite.src = 'images/walkingmikuL.png';
                if (this.x-1 == this.toWalk) {
                    this.isStanding = true;
                    this.wait = 200;
                }

                this.x--;
            }

            if (this.toWalk == this.x || (this.toWalk === undefined && !this.isFalling) ) {
                this.toWalk = Math.floor(Math.random() * ((CANVAS_WIDTH-60) - 0) ) + 0;
                this.isStanding = false;
            }

        }

        if (this.isFalling) {
            this.sprite.src = 'images/fallingmiku.png';
            this.y += 5;
            this.isStanding = false;
        }

        if (this.y > CANVAS_HEIGHT) {
            arrToDraw.splice(arrToDraw.indexOf(this),1);
        }
    }
}

function update(timestamp) {
    if (animationPaused) return;
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    arrToDraw.forEach(element => {
        element.update();
    });
}

function start() {
    if (animationPaused) return;
    requestAnimationFrame(update);
}

function toggleMiku() {
    const mikuCanvas = document.getElementById("miku-canvas");
    const mikuButton = document.getElementById("hideMikuButton");
    
    if (!animationPaused) {
        // Hide Miku
        mikuCanvas.style.display = "none";
        mikuButton.textContent = "Show Miku";
        animationPaused = true;
        
        // Cancel the animation frame to stop execution
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    } else {
        // Show Miku
        mikuCanvas.style.display = "block";
        mikuButton.textContent = "Hide Miku";
        animationPaused = false;
        
        // Resume animation
        lastTimestamp = performance.now();
        animationFrameId = requestAnimationFrame(update);
    }
}

window.addEventListener("click", (event) => {
    var newMiku = new Miku(context, event.x, event.y);
    arrToDraw.push(newMiku);
});

window.addEventListener("resize", (event) => {
    CANVAS_WIDTH = canvas.width = window.innerWidth;
    CANVAS_HEIGHT = canvas.height = window.innerHeight;
    arrToDraw.forEach(element => {
        element.wait = 0;
    });
});

document.addEventListener("DOMContentLoaded", (event) => {
    canvas = document.getElementById("miku-canvas");
    context = canvas.getContext("2d");

    CANVAS_WIDTH = canvas.width = window.innerWidth;
    CANVAS_HEIGHT = canvas.height = window.innerHeight;

    const miku1 = new Miku(context,0,0);
    arrToDraw.push(miku1);

    const hideMikuButton = document.getElementById("hideMikuButton");
    hideMikuButton.addEventListener("click", toggleMiku);

    start();
});
