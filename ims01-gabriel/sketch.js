let t = 0;
let g;
let g2;
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

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSL);
  g = createGraphics(patternWidth, patternWidth);
  g2 = createGraphics(patternWidth, patternWidth);
  g.colorMode(HSL);
  h = height / rows;
  w = width / cols;
  c1 = color(h1, 90, 450);
  c2 = color(h2, 90, 45);
  startoffx = 0;
  startoffy = 0;
  destoffx = startoffx;
  destoffy = startoffy;
  noStroke();
  makeGrid();
}

function draw() {
  // background(0, 50, 10);
  if (frameCount % 120 == 0) {
    makeGrid();
  }
  tilePattern(patternWidth);

  // let angle = sin(t) * 20;
  // let angle2 = sin(t);

  translate(-width / 2 + w / 2, -height / 2 + h / 2, 0);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * w;
      let y = j * h;
      let gid = grid[j][i];
      tile(x, y, w, h, gid);
    }
  }

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

function makeGrid() {
  grid = [];
  for (let j = 0; j < rows; j++) {
    let row = [];
    for (let i = 0; i < cols; i++) {
      let v;
      if (random() > 0.4) {
        v = 1;
      } else {
        v = 0;
      }
      row.push(v);
    }
    grid.push(row);
  }
}

let percent = 0;
function tile(x, y, w, h, gid) {
  let eased = easeInSine(percent);
  let currxoff = lerp(startoffx, destoffx, eased);
  let curryoff = lerp(startoffy, destoffy, eased);

  if (percent >= 1) {
    startoffx = destoffx;
    startoffy = destoffy;
    destoffx = random(-2, 2);
    destoffy = random(-4, 4);

    percent = 0;
  }

  push();
  // translate(width / 2, height / 2);
  translate(x + currxoff, y + curryoff);

  if (gid) {
    texture(g2);
  } else {
    texture(g);
  }

  plane(w, h);
  pop();
  percent += 0.006;
}

function tilePattern(w) {
  // c1 = color(h1, 20, 50);
  // c2 = color(h2, 60, 50);

  g.push();

  let increment = TWO_PI / w;
  let step = 0;
  for (let x = 0; x <= w; x++) {
    // let lerped = lerpColor(c2, c1, x / w);

    let sinHue = map(sin(step), -1, 1, h1, h2);

    g.stroke(sinHue, 40, 50);
    // g.stroke(lerped);
    strokeWeight(1);
    g.line(x, 0, x, w);
    step += increment;
  }

  g2.image(g, 0, 0);
  g2.filter(INVERT, 10);

  h1 = (h1 + increment * 10) % 360;
  h2 = (h2 + increment * 10) % 360;
}

// from easings.net

function easeInSine(x) {
  return 1 - Math.cos((x * Math.PI) / 2);
}
