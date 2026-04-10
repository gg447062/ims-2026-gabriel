let t = 0;
let g;
let g2;
let g3;
let patternWidth = 200;
let c1, c2;
let h1 = 0;
let h2 = 120;
let bg = 240;
let rows = 8;
let cols = 8;
let h, w;

let grid = [];

let startoffx;
let startoffy;
let destoffx;
let destoffy;

let txtr;

function preload() {
  txtr = loadImage('Charcoal_small.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  imageMode(CENTER);
  colorMode(HSL);
  g = createGraphics(patternWidth, patternWidth);
  g2 = createGraphics(patternWidth, patternWidth);
  g3 = createGraphics(width, height);

  g.colorMode(HSL);
  h = height / rows;
  w = width / cols;
  c1 = color(h1, 90, 450);
  c2 = color(h2, 90, 45);
  g3.image(txtr, 0, 0, width, height);
  g3.filter(INVERT);

  noStroke();
}

function draw() {
  background(0, 50, 10);

  tilePattern(patternWidth);

  for (let s of [1, -1]) {
    push();
    scale(s, 1);
    translate(-400, 0, 0);
    rotateY(QUARTER_PI * 1.5);
    texture(g2);
    plane(width * 0.81, height);
    pop();
  }

  filter(BLUR, 4);
  tint(255, 0.1);
  blendMode(SCREEN);
  image(g3, 0, 0, width, height);

  t += 0.01;
}

function keyPressed(e) {
  if (e.key == 'f') {
    fullscreen(1);
    setTimeout(() => {
      resizeCanvas(windowWidth, windowHeight);
      h = height / rows;
      w = width / cols;
    }, 1000);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  h = height / rows;
  w = width / cols;
}

function tilePattern(w) {
  c1 = color(h1, 20, 50);
  c2 = color(h2, 60, 50);

  g.push();

  let increment = 1;
  let step = 0;
  let xoff = 10; //20
  let yoff = 25; //50

  g.background(10, 80, 20);
  g2.image(g, 0, 0);
  for (let x = xoff; x <= w - xoff; x++) {
    let lerped = lerpColor(c2, c1, x / w);

    // let sinHue = map(sin(step), -1, 1, h1, h2);

    // g.stroke(sinHue, 40, 50);
    g2.stroke(lerped, 40, 50);
    strokeWeight(1);
    g2.line(x, yoff, x, w - yoff);
    step += increment;
  }

  // g2.image(g, 0, 0);
  // g2.background(180, 90, 10);
  // g2.filter(INVERT, 10);

  h1 = (h1 + increment) % 360;
  h2 = (h2 + increment) % 360;
}

// from easings.net

function easeInSine(x) {
  return 1 - Math.cos((x * Math.PI) / 2);
}
