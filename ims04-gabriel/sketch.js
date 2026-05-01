// original algorithm from here: https://github.com/jht9629-nyu/DrawPoints/tree/main/DrawPoints

let paths = [];
let currentPath = [];
let imgs = [];
let img, img1, img2, img3, img4;

let cnv;
let clearAllPathsButton;
let clearScreenButton;
let saveCurrentPathButton;
let saveButton;
let nextImageButton;
let prevImageButton;
let drawAll = false;
let imageIdx = 0;

function preload() {
  img = loadImage('Daniil_Kharms_in_1932.jpg');
  img1 = loadImage('Alexander_vvedenskij.jpg');
  img2 = loadImage('Casimir_Malevich_photo.jpg');
  img3 = loadImage('Konstantin_Vaginov.jpg');
  img4 = loadImage('Nikolay_Zabolotsky.jpg');
}

function setup() {
  imgs = [img, img1, img2, img3, img4];
  cnv = createCanvas(windowWidth, windowHeight);
  // cnv.mouseReleased(pushPoints);
  for (let img of imgs) {
    img.resize(height / 2, 0);
  }

  imageMode(CENTER);
  clearAllPathsButton = createButton('clearAllPaths');
  clearAllPathsButton.mousePressed(clearAllPaths);
  clearAllPathsButton.position(0, 0);

  clearScreenButton = createButton('clearCurrentPath');
  clearScreenButton.mousePressed(clearCurrentPath);
  clearScreenButton.position(100, 0);

  saveScreenButton = createButton('saveCurrentPath');
  saveScreenButton.mousePressed(pushPoints);
  saveScreenButton.position(230, 0);

  nextImageButton = createButton('nextImage');
  nextImageButton.mousePressed(nextImage);
  nextImageButton.position(350, 0);

  prevImageButton = createButton('prevImage');
  prevImageButton.mousePressed(prevImage);
  prevImageButton.position(450, 0);

  saveButton = createButton('saveToJson');
  saveButton.mousePressed(savePaths);
  saveButton.position(550, 0);

  noFill();
  stroke(20, 200, 20);
  strokeWeight(2);
}

function mouseDragged() {
  point(mouseX, mouseY);
  currentPath.push({ x: mouseX, y: mouseY });
}

function pushPoints() {
  paths.push([...currentPath]);
}

function nextImage() {
  imageIdx = (imageIdx + 1) % imgs.length;
}

function prevImage() {
  imageIdx -= 1;
  if (imageIdx < 0) {
    imageIdx = imgs.length - 1;
  }
}

function draw() {
  background(200);
  let img = imgs[imageIdx];
  image(img, width / 2, height / 2);
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

function clearCurrentPath() {
  currentPath = [];
}

function clearAllPaths() {
  paths = [];
  currentPath = [];
}

function savePaths() {
  saveJSON(paths, 'paths.json');
}
