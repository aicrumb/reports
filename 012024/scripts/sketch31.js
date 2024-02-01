let agents = [];
let numAgents = 200;
let trailLength = 10;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numAgents; i++) {
    agents.push(new Agent());
  }
}

function draw() {
  background(220);
  rotateY(frameCount * 0.005);

  for (let agent of agents) {
    agent.update();
    agent.display();
  }
}

class Agent {
  constructor() {
    this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
    this.prevPos = this.pos.copy();
    this.vel = p5.Vector.random3D();
    this.vel.setMag(random(2, 5));
    this.noiseScale = 0.1;
    this.trail = [];
  }

  update() {
    // Update the trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > trailLength) {
      this.trail.shift();
    }

    // Update position
    let angleX = noise(this.pos.x * this.noiseScale, this.pos.y * this.noiseScale, frameCount * this.noiseScale) * TWO_PI * 2;
    let angleY = noise(this.pos.y * this.noiseScale, this.pos.z * this.noiseScale, frameCount * this.noiseScale) * TWO_PI * 2;
    let angleZ = noise(this.pos.z * this.noiseScale, this.pos.x * this.noiseScale, frameCount * this.noiseScale) * TWO_PI * 2;
    let dir = createVector(cos(angleX), sin(angleY), sin(angleZ));
    this.vel.lerp(dir, 0.02);
    this.vel.setMag(3);
    this.prevPos = this.pos.copy();
    this.pos.add(this.vel);
  }

  display() {
    // Draw the trail
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let pt = this.trail[i];
      stroke(255, (i / this.trail.length) * 255); // Fade the trail
      vertex(pt.x, pt.y, pt.z);
    }
    endShape();
  }
}
