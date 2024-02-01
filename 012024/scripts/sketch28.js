let inc = 0.1;
let start = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(220);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  noFill();
  stroke(250);
  
  let xOffset = start;
  for (let x = -200; x < 200; x += 25) {
    beginShape();
    let yOffset = 0;
    for (let y = -200; y < 200; y += 5) {
      let z = map(noise(xOffset, yOffset), 0, 1, -100, 100);
      vertex(x, y, z);
      yOffset += inc;
    }
    endShape();
    xOffset += inc;
  }
  start += inc / 10;
}
