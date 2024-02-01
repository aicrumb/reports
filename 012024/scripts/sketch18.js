let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220);

  for (let particle of particles) {
    particle.update();
    particle.show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-200, 200));
    this.vel = p5.Vector.random3D();
    this.vel.mult(random(2, 5));
    this.acc = createVector(0, 0, 0);
    this.size = random(2, 8);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edges();
  }

  applyForce(force) {
    this.acc.add(force);
  }

  edges() {
    if (this.pos.z < -200 || this.pos.z > 200) {
      this.vel.z *= -1;
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    stroke(250);
    noFill();
    sphere(this.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
