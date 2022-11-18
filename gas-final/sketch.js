// comment arriver directement sur la page
// comment faire pour que ca aille sur le téléphone

const debugMode = false;

const YELLOW = "#fffe00";
const WHITE = "#ffffff";

let detectedColor;
let oldDetectedColor;

const phone = window.location.hash.replace("#", "");

let animations1 = [];
let animations2 = [];
let animations3 = [];

function preload() {
  // animations1[0] = loadImage("animations/one0.gif");
  // animations1[1] = loadImage("animations/one1.gif");
  // animations1[2] = loadImage("animations/one2.gif");
  // animations2[0] = loadImage("animations/two0.gif");
  // animations2[1] = loadImage("animations/two1.gif");
  // animations2[2] = loadImage("animations/two2.gif");
  // animations3[0] = loadImage("animations/three0.gif");
  // animations3[1] = loadImage("animations/three1.gif");
  // animations3[2] = loadImage("animations/three2.gif");
}

function setup() {
  console.log(phone);
  window.onhashchange = () => window.location.reload();

  createCanvas(windowWidth, windowHeight);

  beginTrack({ colors: [WHITE], debugMode, mirrored: true }, (event) => {
    detectedColor = event.normalizedData[0];

    // console.log(event.normalizedData);

    if (detectedColor) {
      //! width & height TODO
      //   detectedColor.width *= width;
      //   detectedColor.height *= height;
      detectedColor.x *= width;
      detectedColor.y *= height;
    }

    if (detectedColor && !oldDetectedColor) {
      console.log("detected");

      if (phone === "phone1") {
        $(".wrapper").append(
          "<img src='animations/one" + Math.floor(Math.random() * 3) + ".gif'>"
        );
      }

      if (phone === "phone2") {
        $(".wrapper").append(
          "<img src='animations/two" + Math.floor(Math.random() * 3) + ".gif'>"
        );
      }

      if (phone === "phone3") {
        $(".wrapper").append(
          "<img src='animations/three" +
            Math.floor(Math.random() * 3) +
            ".gif'>"
        );
      }
    } else if (!detectedColor && oldDetectedColor) {
      console.log("not detected");

      $(".wrapper").empty();
    }

    oldDetectedColor = detectedColor;
  });
}

function draw() {
  background("black");

  // if (detectedColor !== undefined) {
  //   if (phone === "phone1") {
  //   }

  //   if (phone === "phone2") {
  //   }

  //   if (phone === "phone3") {
  //   }

  //   if (phone === "phone4") {
  //   }

  // console.log(detectedColor);
  // console.log(detectedColor.x, detectedColor.y);
  // ellipse(detectedColor.x, detectedColor.y, 10);
  // image(animations1[gifChoice], 0, 0, windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
