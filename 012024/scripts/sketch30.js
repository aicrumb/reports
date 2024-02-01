let particles = [];
let numParticles = 2000;
let sphereRadius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(240);
  rotateY(frameCount * 0.01);

  let mouse = createVector(mouseX - width / 2, mouseY - height / 2, 0);

  for (let particle of particles) {
    particle.behave(mouse);
    particle.update();
    particle.display();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random3D().mult(sphereRadius);
    this.vel = p5.Vector.random3D();
    this.acc = createVector();
    this.maxSpeed = 2;
    this.maxForce = 0.05;
  }

  behave(mouse) {
    let d = dist(mouse.x, mouse.y, mouse.z, this.pos.x, this.pos.y, this.pos.z);
    if (d < 150) {
      // Scatter away from the mouse
      let steer = p5.Vector.sub(this.pos, mouse);
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    } else if (d < sphereRadius) {
      // Gently gravitate towards the mouse
      let attract = p5.Vector.sub(mouse, this.pos);
      attract.setMag(this.maxSpeed / 2);
      attract.sub(this.vel);
      attract.limit(this.maxForce / 2);
      this.applyForce(attract);
    }

    // Stay within the spherical boundary
    if (this.pos.mag() > sphereRadius) {
      let toCenter = p5.Vector.mult(this.pos, -1);
      toCenter.setMag(this.maxSpeed);
      toCenter.sub(this.vel);
      toCenter.limit(this.maxForce);
      this.applyForce(toCenter);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y, this.pos.z);
    pop();
  }
}
