let cubes = [];
let numCubes = 80;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numCubes; i++) {
    cubes.push(new Cube(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-500, 500), random(20, 70)));
  }
}

function draw() {
  background(220);

  for (let cube of cubes) {
    cube.bounce();
    cube.show();
  }
}

class Cube {
  constructor(x, y, z, s) {
    this.originalY = y; // Save the original Y position
    this.pos = createVector(x, y, z);
    this.size = s;
    this.bounceSpeed = random(0.01, 0.05); // Speed of bouncing
    this.bounceHeight = random(5, 20); // Amplitude of bouncing
  }

  bounce() {
    // Calculate the Y position using sine wave
    let bounceY = sin(frameCount * this.bounceSpeed) * this.bounceHeight;
    this.pos.y = this.originalY + bounceY;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    fill(255, 100);
    stroke(255);
    box(this.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
