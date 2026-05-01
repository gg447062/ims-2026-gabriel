let points = [];
let paths;
let pathCount;
let maxPoints = 0;

function preload() {
  paths = loadJSON('paths_2.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let totalFrames = 300;
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
    let home = { x: currentPoint.x, y: currentPoint.y };
    let dest = { x: currentPoint.x, y: currentPoint.y };
    points.push(new Point(i, 0, home, dest, totalFrames));
  }
}

function draw() {
  background(20);
  displayPoints();
  // displayShape();
}

function displayPoints() {
  for (let p of points) {
    p.show();
    p.update();
  }
}

function displayShape() {
  beginShape();
  stroke(20, 200, 20);
  strokeWeight(2);
  for (let p of points) {
    p.showVertex();
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
  constructor(id, pathIndex, home, dest, frames) {
    this.id = id;
    this.pathIndex = pathIndex;
    this.home = home;
    this.dest = dest;
    this.pos = { ...home };
    this.totalFrames = frames;
    this.restTime = 1000;
    this.frameCounter = 0;
    this.restCounter = 0;
    this.state = 0;
    this.percent = 0;
  }

  update() {
    if (this.state == 0) {
      // REST STATE
      this.pos = { ...this.dest };
      // if rest state is over, switch to move state and reset counters
      if (this.restCounter >= this.restTime) {
        this.state = 1;
        this.frameCounter = 0;
        this.dest = { x: random(width), y: random(height) };
      } else {
        this.restCounter += deltaTime;
      }
    } else {
      // MOVE STATES
      this.percent =
        (this.frameCounter % (this.totalFrames + 1)) / this.totalFrames;
      // let easedPercent = easeOutBounce(this.percent);
      let easedPercent = easeInOutExpo(this.percent);

      this.pos.x = map(easedPercent, 0.0, 1, this.home.x, this.dest.x);
      this.pos.y = map(easedPercent, 0.0, 1, this.home.y, this.dest.y);

      if (this.frameCounter == this.totalFrames) {
        this.home = { ...this.dest };

        if (this.state == 1) {
          // if the first movement phase is over, set everything for the second movement phase
          this.state = 2;
          this.frameCounter = 0;
          this.pathIndex = (this.pathIndex + 1) % pathCount;
          // get the current path and the next destination coordinates
          let currentPath = paths[this.pathIndex];
          let index = this.id % currentPath.length;
          let currentPoint = currentPath[index];
          this.dest = { x: currentPoint.x, y: currentPoint.y };
        } else if (this.state == 2) {
          // if the second movement phase is over, set everything for the rest phase
          this.state = 0;
          this.restCounter = 0;
        }
      } else {
        this.frameCounter++;
      }
    }
  }

  show() {
    stroke(200);
    // stroke(20, 200, 20);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
  }

  showVertex() {
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
