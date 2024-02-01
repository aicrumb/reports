let cubes = [];
let numCubes = 10;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numCubes; i++) {
    cubes.push(new Cube(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-500, 500), random(20, 70)));
  }
}

function draw() {
  background(200);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);

  for (let cube of cubes) {
    cube.update();
    cube.show();
  }
}

class Cube {
  constructor(x, y, z, s) {
    this.pos = createVector(x, y, z);
    this.size = s;
    this.rotX = random(TWO_PI);
    this.rotY = random(TWO_PI);
    this.rotZ = random(TWO_PI);
    this.speedX = random(0.01, 0.03);
    this.speedY = random(0.01, 0.03);
    this.speedZ = random(0.01, 0.03);
  }

  update() {
    this.rotX += this.speedX;
    this.rotY += this.speedY;
    this.rotZ += this.speedZ;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rotX);
    rotateY(this.rotY);
    rotateZ(this.rotZ);
    fill(240, 100);
    stroke(240);
    box(this.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
