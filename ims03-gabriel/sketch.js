// the basic meta balls code is from this coding train video
// https://www.youtube.com/watch?v=ccYLb7cLB1I&t=569s
// i wanted to play with sine waves instead of having random motion

// it runs way faster on localhost than it does on the p5 editor

let balls = [];

let high;
let low;
let size;
let smallCanvas;
let xR, yR;
let t = 0;
let dx = 0;

let sizeMult = 0.016;

function setup() {
  colorMode(HSL);
  // main drawing canvas
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  low = 50;
  high = 230;
  // this canvas is for computing the ball position and colors
  // it's very small because of all the calculations that have to be done on
  // each pixel each frame.
  //
  smallCanvas = createGraphics(200, 150);

  size = width * sizeMult;

  // the multiplier for sizing up the small canvas pixels to draw on the main canvas
  xR = width / smallCanvas.width;
  yR = height / smallCanvas.height;
  noStroke();

  let w = smallCanvas.width / 15;

  for (let i = 0; i < 15; i++) {
    // let x = i * w;
    let x = map(
      i,
      0,
      15,
      smallCanvas.width * 0.2,
      smallCanvas.width - smallCanvas.width * 0.2,
    );

    let y = smallCanvas.height / 2;
    balls.push(new Ball(x, y));
  }
}

// go all in
function keyPressed(e) {
  if (e.key == 'f') {
    fullscreen(1);
    setTimeout(() => {
      resizeCanvas(windowWidth, windowHeight);
      size = width * sizeMult;
      xR = canvas.width / smallCanvas.width;
      yR = canvas.height / smallCanvas.height;
    }, 500);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // i'm adapting something i made a while ago
  // so i don't remember what this is but i think the size variable is the

  size = width * sizeMult;
  xR = width / smallCanvas.width;
  yR = height / smallCanvas.height;
}

//  ****** DRAW ******

function draw() {
  // move the balls along the sine wave
  for (let ball of balls) {
    ball.update(t);
    // ball.show(xR, yR);
  }

  // change the colors
  updateHues();

  // draw the updated pixels
  drawPixels();

  // increment the time counter
  t += 0.008;
  // increment the delta x for the sine wave
  dx += 1;
}

function updateHues() {
  // modulating the high and low values of the hue constraint with sine and cosine waves
  //
  low = 50 + cos(t * 2) * 20;
  high = 230 + sin(t / 2) * 30;

  // if (sin(t) > 0.95) {
  //   low = random(130);
  //   high = random(140, 240);
  // }
}

function drawPixels() {
  // amount of granulation

  let amt = 2;
  smallCanvas.loadPixels();

  // iterate over every pixel in the small canvas and compute its color
  //  based on its proximity to any metaballs
  for (let i = 0; i < smallCanvas.width; i++) {
    for (let j = 0; j < smallCanvas.height; j++) {
      // for the pixel at small canvas pixels[i][j]
      // add up the distances from this pixel to each of the
      // metaballs, starting the total at 0
      let total = 0;
      for (let ball of balls) {
        const d = dist(ball.pos.x, ball.pos.y, i, j);
        // this is the math for determining the weight of the individual distances on the total
        const col = (size * ball.r) / d;
        // i'm turning it down here even further
        total += col * 0.8;
      }

      // invert the colors
      total = 360 - total;

      // make sure the color is within the ranges set above

      let v = constrain(total, low, high);
      let granulated = v + random(-amt, amt);

      let c = color(granulated, 42, 48, 0.5);
      fill(c);
      rect(i * xR, j * yR, xR, yR);
    }
  }
}

class Ball {
  constructor(x, y) {
    this.pos = { x: x, y: y };
    this.r = 25;
  }

  update(t) {
    let h = smallCanvas.height / 2;
    let period = sin(t) * 60 + 10;
    //  y = height/2 + amplitude * sin((x + dx) / period)
    this.pos.y = h + (h / 2) * sin((this.pos.x + dx) / period);
  }

  show(w = 1, h = 1) {
    let x = this.pos.x * w;
    let y = this.pos.y * h;

    let c = lerp(curr_low, curr_high, 0.5);
    fill(c, 100, 60, 0.5);

    circle(x, y, this.r * 2);
  }
}
