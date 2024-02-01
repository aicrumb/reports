let particles = [];
let numParticles = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220);

  // Rotate the whole scene
  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.01);

  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

class Particle {
  constructor() {
    this.position = createVector(random(-200, 200), random(-200, 200), random(-200, 200));
    this.velocity = p5.Vector.random3D();
    this.color = color(random(255), random(255), random(255), 20);
  }

  update() {
    this.position.add(this.velocity);
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    noStroke();
    fill(this.color);
    sphere(10); // Size of the particle
    pop();
  }
}
