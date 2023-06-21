// set up canvas

const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var width;
var height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// random number

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// random ball's color

function randomColor() {
  return 'rgb(' + random(0, 255) + ', ' + random(0,255) + ', ' + random(0,255) + ')';
}

// model of balls

class Shape { 
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
} 

class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
      super(x, y, velX, velY);

      this.color = color;
      this.size = size;
      this.exists = true;
    }

    collisionDetect() {
      for(let j = 0; j < balls.length; j++) {
        if (this !== balls[j]) {
          const dx = this.x - balls[j].x;
          const dy = this.y - balls[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
    
          if (distance < this.size + balls[j].size) {
            balls[j].color = this.color = randomColor();
          }
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }

    update() {
      if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }
      
      if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }
    
      if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      } 
    
      if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }
    
      this.x += this.velX;
      this.y += this.velY;
    }

}

// model of evilCircle

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = 'white';
    this.size = 10; 

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x -= this.size;
    }
    
    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }
  
    if ((this.y + this.size) >= height) {
      this.y -= this.size;
    } 
  
    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }

  collisionDetect() {
    for(let j = 0; j < balls.length; j++) {
      if (balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].exists = false;
          count--;
          para.textContent = 'Ball count: ' + count;
        }
      }
    }
  }
}

// define array to store balls and populate it

const balls = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

const evilBall = new EvilCircle(random(0, width), random(0, height));

// loop everything

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    if(balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    } 
  }

  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  requestAnimationFrame(loop);
}

loop();