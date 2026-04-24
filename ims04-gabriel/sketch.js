// original algorithm from here: https://github.com/jht9629-nyu/DrawPoints/tree/main/DrawPoints

let paths = [];
let currentPath = [];

let cnv;
let clearAllPathsButton;
let clearScreenButton;
let saveButton;
let drawAll = 0;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseReleased(pushPoints);

  clearAllPathsButton = createButton('clearAllPaths');
  clearAllPathsButton.mousePressed(clearAllPaths);

  clearScreenButton = createButton('clearScreen');
  clearScreenButton.mousePressed(clearScreen);

  saveButton = createButton('save');
  saveButton.mousePressed(savePaths);

  noFill();
  stroke(20);
  strokeWeight(2);
}

function mouseDragged() {
  point(mouseX, mouseY);
  currentPath.push({ x: mouseX, y: mouseY });
}

function pushPoints() {
  paths.push([...currentPath]);
}

function draw() {
  background(200);
  if (currentPath.length) {
    beginShape();
    for (let point of currentPath) {
      vertex(point.x, point.y);
    }
    endShape();
  }
  if (drawAll) {
    for (let path of paths) {
      beginShape();
      for (let point of path) {
        vertex(point.x, point.y);
      }
      endShape();
    }
  }
}

function clearScreen() {
  background(20);
  currentPath = [];
}

function clearAllPaths() {
  paths = [];
  currentPath = [];
}

function savePaths() {
  saveJSON(paths, 'paths.json');
}
