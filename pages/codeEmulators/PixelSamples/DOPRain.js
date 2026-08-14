//DOP Version of Rain.js

particles = []

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

//A more strongly DOP style would have each property within their own array.
for(let x = 0; x != 200; x++) {
    particles.push({
        "posX" : getRandom(0, gfx.width),
        "posY" : getRandom(0, gfx.height),
        "velX" : 0.5,
        "velY" : getRandom(1, 4)
    })
}

function draw(){
    gfx.clear("#111");

    particles.forEach((value) => {
        let posX = value["posX"];
        let posY = value["posY"];
        gfx.pixel(posX, posY, "CYAN");
        posX += value["velX"];
        posY += value["velY"];


        if (posY >= gfx.height) {
            posY = -10
        }

        if (posX >= gfx.width) {
            posX = -1
        }

        value["posX"] = posX;
        value["posY"] = posY;
    });
}