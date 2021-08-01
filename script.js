const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;

const scoreSheet = document.querySelector(".score");

let roadSpeed = 5,
    base_image = [],
    car,
    canvasPainter,
    score = 0,
    mainCarImage,
    isCollided = false;

class Stripe {
    constructor(x, y, speed = roadSpeed) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.height = 40;
        this.width = 10;
        this.drawStripe();
    }

    drawStripe() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function randomNo(max) {
    max++;
    return Math.random() * max;
}

function randomIntegrer(max) {
    max++;
    return Math.trunc(Math.random() * max);
}

class Rectangle {
    static height = 90;
    static width = 50;
    constructor(x, y, type = "blocks", speed = roadSpeed) {
        this.speed = speed;
        this.type = type;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.imageNo = randomIntegrer(5);
        this.drawRectangle();
    }

    drawRectangle() {
        ctx.fillStyle = "Red";
        if (this.type === "car") ctx.fillStyle = "Green";

        // ctx.fillRect(this.x, this.y, Rectangle.width, Rectangle.height);

        ctx.drawImage(
            base_image[this.imageNo],
            this.x,
            this.y,
            Rectangle.width,
            Rectangle.height
        );
    }
}

let stripes = [];
let blocks = [];

function checkCollision() {
    for (let b of blocks) {
        if (
            b.x + Rectangle.width < car.x ||
            car.x + Rectangle.width < b.x ||
            b.y + Rectangle.height < car.y ||
            car.y + Rectangle.height < b.y
        ) {
            //not colliding
        } else {
            //colliding
            scoreSheet.textContent = "0";
            isCollided = true;
            ctx.font = "bold 40px Georgia";
            ctx.fillStyle = "Yellow";
            ctx.fillRect(0, 0, 600, 300);
            ctx.fillStyle = "green";
            ctx.fillText(`Game over ! Score : ${score}.`, 100, 150);
            ctx.fillText(`Press Enter/Click Anywhere `, 40, 200);
            score = 0;
            return true;
        }
    }
    return false;
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (stripes[9].y + stripes[9].height >= canvas.height) {
        stripes.unshift(new Stripe(canvas.width / 2 - 5, -stripes[0].height));
        stripes.pop();
    }
    stripes.forEach((s) => (s.y = s.y + s.speed));
    stripes.forEach((s) => s.drawStripe());

    if (blocks[blocks.length - 1].y + Rectangle.height >= canvas.height) {
        blocks.unshift(
            new Rectangle(
                randomNo(canvas.width - Rectangle.height),
                -Rectangle.height
            )
        );
        if (blocks.length > 3) blocks.pop();
    }
    blocks.forEach((s) => (s.y = s.y + s.speed));
    blocks.forEach((s) => s.drawRectangle());

    if (car.x <= 0 && car.dx >= 0) car.x += car.dx;

    if (car.x + Rectangle.width >= canvas.width && car.dx < 0) car.x += car.dx;

    if (car.x > 0 && car.x + Rectangle.width < canvas.width) car.x += car.dx;
    car.drawRectangle();
    if (checkCollision()) return clearInterval(canvasPainter);
    score++;
    scoreSheet.textContent = score;
}

function keyDownHandler(e) {
    if (e.key === "ArrowLeft") {
        if (car.x <= 0) return;
        car.dx = -3;
    }
    if (e.key === "ArrowRight") {
        if (car.x + Rectangle.width >= canvas.width) return;
        car.dx = 3;
    }
}

function keyUpHandler() {
    car.dx = 0;
}

function restartGame(e) {
    if (isCollided && (e.key === "Enter" || e.type === "click")) {
        stripes = [];
        blocks = [];
        score = 0;
        init();
    }
}

function init() {
    isCollided = false;
    for (let i = 1; i <= 10; i++) {
        stripes.push(
            new Stripe(canvas.width / 2 - 5, 0 + (i - 1) * (canvas.height / 10))
        );
    }

    for (let i = 1; i <= 4; i++) {
        blocks.push(
            new Rectangle(
                randomNo(canvas.width - Rectangle.height),
                -Rectangle.height + (i - 1) * (canvas.height / 4) - 500
            )
        );
    }

    car = new Rectangle(canvas.width / 2 - Rectangle.height / 2, 600, "car");

    // base_image.onload = () => {};
    canvasPainter = setInterval(updateCanvas, 10);
}

function loadImage(i) {
    return new Promise((resolve) => {
        const image = new Image();
        base_image.push(image);

        image.addEventListener("load", () => {
            resolve(image);
        });

        image.src = `./images/car${i}.png`;
    });
}

(() => {
    const promises = [];
    for (let i = 1; i <= 6; i++) {
        promises.push(loadImage(i));
    }
    Promise.all(promises).then(() => {
        console.log("Images loaded");
        init();
    });
})();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keydown", restartGame);
canvas.addEventListener("click", restartGame);
document.querySelector(".left").addEventListener("mousedown", () => {
    if (car.x <= 0) return;
    car.dx = -3;
});
document.querySelector(".right").addEventListener("mousedown", () => {
    if (car.x + Rectangle.width >= canvas.width) return;
    car.dx = 3;
});
document.querySelector(".left").addEventListener("mouseup", () => {
    car.dx = 0;
});
document.querySelector(".right").addEventListener("mouseup", () => {
    car.dx = 0;
});
