let particles = [];
let numParticles = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220);
  rotateY(frameCount * 0.01);

  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random3D().mult(250);
    this.vel = createVector();
    this.acc = createVector();
    this.maxSpeed = 2;
    this.maxForce = 0.05;
  }

  update() {
    let mouse = createVector(mouseX - width / 2, mouseY - height / 2, 200);
    let dir = p5.Vector.sub(mouse, this.pos);
    dir.normalize();
    dir.mult(this.maxSpeed);
    let steer = p5.Vector.sub(dir, this.vel);
    steer.limit(this.maxForce);

    this.acc.add(steer);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    stroke(250);
    strokeWeight(4);
    point(this.pos.x, this.pos.y, this.pos.z);
  }
}
