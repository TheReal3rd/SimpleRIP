const width = app.screen.width;
const height = app.screen.height;

const box = new PIXI.Graphics();
box.beginFill(0x4c6ef5);
box.drawRect(0, 0, 80, 80);
box.endFill();

box.x = 150;
box.y = 120;
let vx = 10;
let vy = 10;

app.stage.addChild(box);

app.ticker.add(() => {
    box.x += vx;
    box.y += vy;

    if (box.y + 40 >= height || box.y <= 0) {
        vy = vy * -1;
    }
    if (box.x + 40 >= width || box.x <= 0) {
        vx = vx * -1;
    }
});
