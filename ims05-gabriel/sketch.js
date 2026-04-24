let points = [];
let paths;
let pathCount;
let maxPoints = 0;

function preload() {
  paths = loadJSON('paths.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let totalFrames = 100;
  noFill();

  pathCount = Object.keys(paths).length;
  for (let v of Object.values(paths)) {
    if (v.length > maxPoints) {
      maxPoints = v.length;
    }
  }

  for (let i = 0; i < maxPoints; i++) {
    let currentPath = paths[0];
    let index = i % currentPath.length;
    let currentPoint = currentPath[index];
    let start = { x: random(width), y: random(height) };
    let end = { x: currentPoint.x, y: currentPoint.y };
    points.push(new Point(i, 0, start, end, totalFrames));
  }
}

function draw() {
  background(20);
  beginShape();
  strokeWeight(2);
  for (let p of points) {
    p.show();
    p.update();
  }
  endShape();
}

function keyPressed(e) {
  if (e.key == 'f') {
    fullscreen(1);
    setTimeout(() => {
      resizeCanvas(windowWidth, windowHeight);
    }, 500);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// add an active state counter and a rest state counter
// use delta time for the rest state
class Point {
  constructor(id, pathIndex, start, end, frames) {
    this.id = id;
    this.pathIndex = pathIndex;
    this.start = start;
    this.end = end;
    this.pos = { ...start };
    this.totalFrames = frames;
    this.restTime = 200;
    this.frameCounter = 0;
    this.restCounter = 0;
    this.state = 1;
    this.percent = 0;
  }

  update() {
    this.percent =
      (this.frameCounter % (this.totalFrames + 1)) / this.totalFrames;
    // let easedPercent = easeOutBounce(this.percent);
    let easedPercent = easeInOutExpo(this.percent);

    this.pos.x = map(easedPercent, 0.0, 1, this.start.x, this.end.x);
    this.pos.y = map(easedPercent, 0.0, 1, this.start.y, this.end.y);

    if (this.state == 1) {
      if (this.frameCounter == this.totalFrames) {
        this.start = { ...this.end };
        this.state = 0;
        this.restCounter = 0;
      } else {
        this.frameCounter++;
      }
    } else {
      this.pos = { ...this.end };
      if (this.restCounter >= this.restTime) {
        this.state = 1;
        this.frameCounter = 0;
        this.pathIndex = (this.pathIndex + 1) % pathCount;
        let currentPath = paths[this.pathIndex];
        let index = this.id % currentPath.length;
        let currentPoint = currentPath[index];
        this.end = { x: currentPoint.x, y: currentPoint.y };
      } else {
        this.restCounter += deltaTime;
      }
    }
  }

  show() {
    stroke(200);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
    vertex(this.pos.x, this.pos.y);
  }
}

function easeInOutExpo(x) {
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}
