let points = [];
let springs = [];
let cols = 10;
let rows = 10;
let spacing = 40;
let forceThreshold = 0.9999;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create points
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let p = new Particle(x * spacing - (cols * spacing) / 2, y * spacing - (rows * spacing) / 2, 0);
      points.push(p);
    }
  }

  // Create springs
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (dist(points[i].x, points[i].y, points[j].x, points[j].y) < spacing * 1.5) {
        springs.push(new Spring(points[i], points[j]));
      }
    }
  }
}

function draw() {
  background(220);
  rotateY(frameCount * 0.01);
  
  // Apply random forces
  for (let p of points) {
    if (random(1) < forceThreshold) {
      p.applyForce(p5.Vector.random3D().mult(2));
    }
    p.update();
  }

  // Update springs
  for (let s of springs) {
    s.update();
    s.show();
  }

  // Show points
  for (let p of points) {
    p.show();
  }
}

class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = createVector();
    this.acc = createVector();
    this.radius = 10;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    fill(255);
    noStroke();
    sphere(this.radius);
    pop();
  }
}

class Spring {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.len = spacing;
    this.stiffness = 0.1;
  }

  update() {
    let force = p5.Vector.sub(this.b.pos, this.a.pos);
    let d = force.mag();
    let stretch = d - this.len;
    force.normalize();
    force.mult(-1 * this.stiffness * stretch);
    this.a.applyForce(force);
    force.mult(-1);
    this.b.applyForce(force);
  }

  show() {
    stroke(255);
    line(this.a.pos.x, this.a.pos.y, this.a.pos.z, this.b.pos.x, this.b.pos.y, this.b.pos.z);
  }
}
