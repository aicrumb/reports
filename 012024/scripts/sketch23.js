let cols, rows;
let scale = 40;
let w = 1400;
let h = 1000;
let terrain = [];
let flying = 0;

let camXRotation = 0;
let camYRotation = 0;
let camZOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cols = w / scale;
  rows = h / scale;
  
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0;
    }
  }
}

function draw() {
  flying -= 0.05; // Adjust for slower terrain movement
  let yoff = flying;

  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.1;
    }
    yoff += 0.1;
  }

  background(220);
  stroke(250);
  noFill();

  // Camera controls
  camXRotation = map(mouseY, 0, height, -PI, PI);
  camYRotation = map(mouseX, 0, width, -PI, PI);
  camZOffset = height / 2 - scale * rows / 2;

  // Apply camera transformations
  translate(0, camZOffset, -500);
  rotateX(camXRotation);
  rotateY(camYRotation);
  translate(-w / 2, -h / 2);

  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * scale, y * scale, terrain[x][y]);
      vertex(x * scale, (y + 1) * scale, terrain[x][y + 1]);
    }
    endShape();
  }
}
