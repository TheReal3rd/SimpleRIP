class Particle {

    constructor() {
        this.pixelX = getRandom(0, gfx.width);
        this.pixelY = getRandom(0, gfx.height);
        this.velX = 0.5;
        this.velY = getRandom(1, 4);
    }

    update() {
        this.pixelX += this.velX;
        this.pixelY += this.velY;

        if(this.pixelY >= gfx.height) {
            this.pixelY = -10;
        }

        if(this.pixelX >= gfx.width) {
            this.pixelX = -10;
        }
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
let parts = [];

for(let x = 0; x != 200; x++) {
    parts.push(new Particle());
}

function draw(){
    gfx.clear("#111");

    parts.forEach((x) => {
        gfx.pixel(x.pixelX, x.pixelY, "CYAN");
        x.update();
    })
}
