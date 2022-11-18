function initGUIControllers(tracker, custom) {
  // GUI Controllers

  var gui = new dat.GUI();

  var trackedColors = {
    custom: true,
  };

  // Object.keys(tracking.ColorTracker.knownColors_).forEach(function (color) {
  //   trackedColors[color] = true;
  // });

  trackedColors["yellow"] = true;

  tracker.customColor = custom;

  createCustomColor(tracker.customColor);

  function createCustomColor(value) {
    var components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    var customColorR = parseInt(components[1], 16);
    var customColorG = parseInt(components[2], 16);
    var customColorB = parseInt(components[3], 16);

    var colorTotal = customColorR + customColorG + customColorB;

    if (colorTotal === 0) {
      tracking.ColorTracker.registerColor("custom", function (r, g, b) {
        return r + g + b < 10;
      });
    } else {
      var rRatio = customColorR / colorTotal;
      var gRatio = customColorG / colorTotal;

      tracking.ColorTracker.registerColor("custom", function (r, g, b) {
        var colorTotal2 = r + g + b;

        if (colorTotal2 === 0) {
          if (colorTotal < 10) {
            return true;
          }
          return false;
        }

        var rRatio2 = r / colorTotal2,
          gRatio2 = g / colorTotal2,
          deltaColorTotal = colorTotal / colorTotal2,
          deltaR = rRatio / rRatio2,
          deltaG = gRatio / gRatio2;

        return (
          deltaColorTotal > 0.9 &&
          deltaColorTotal < 1.1 &&
          deltaR > 0.9 &&
          deltaR < 1.1 &&
          deltaG > 0.9 &&
          deltaG < 1.1
        );
      });
    }

    updateColors();
  }

  function updateColors() {
    var colors = [];

    for (var color in trackedColors) {
      if (trackedColors[color]) {
        colors.push(color);
      }
    }

    tracker.setColors(colors);
  }

  var colorsFolder = gui.addFolder("Colors");

  Object.keys(trackedColors).forEach(function (color) {
    if (color !== "custom") {
      colorsFolder.add(trackedColors, color).onFinishChange(updateColors);
    }
  });

  // colorsFolder.add(trackedColors, "custom").onFinishChange(function (value) {
  //   if (value) {
  //   } else {
  //     colorsFolder.remove(this.customColorElement);
  //   }
  // });

  colorsFolder.customColorElement = colorsFolder
    .addColor(tracker, "customColor")
    .onChange(createCustomColor);

  var parametersFolder = gui.addFolder("Parameters");

  parametersFolder.add(tracker, "minDimension", 1, 100);
  parametersFolder.add(tracker, "minGroupSize", 1, 100);

  colorsFolder.open();
  parametersFolder.open();

  updateColors();
}

function showSettings(shown) {
  document.body.classList.toggle("hideDebugger", !shown);
}

function normalizeValue(value, max, mirror) {
  value = value / max;
  if (mirror) value = Math.abs(1 - value);
  return value;
}

function normalizeData(data, { width, height, mirrored }) {
  const normalizedData = data.map((e) => {
    const obj = Object.assign({}, e);

    obj.width = normalizeValue(e.width, width, mirrored);
    obj.height = normalizeValue(e.height, height);
    obj.x = normalizeValue(e.x, width, mirrored);
    obj.y = normalizeValue(e.y, height);

    return obj;
  });

  return normalizedData;
}

function beginTrack({ debugMode, colors, mirrored }, callback) {
  var tracker = new tracking.ColorTracker();

  showSettings(debugMode);

  var canvas = document.querySelector("#debugger > canvas");
  var context = canvas.getContext("2d");

  tracking.track("#video", tracker, { camera: true });

  video.oncanplay = () => {
    video.play();
    // console.dir(video);
  };

  tracker.on("track", function (event) {
    canvas.width = video.width;
    canvas.height = video.height;

    context.drawImage(video, 0, 0, video.width, video.height);

    const normalizedData = normalizeData(event.data, {
      width: video.width,
      height: video.height,
      mirrored,
    });

    callback({ normalizedData, ...event });
    // context.clearRect(0, 0, canvas.width, canvas.height);

    event.data.forEach(function (rect) {
      if (rect.color === "custom") {
        rect.color = tracker.customColor;
      }

      context.strokeStyle = rect.color;
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = "11px Helvetica";
      context.fillStyle = "#fff";
      context.fillText(
        "x: " + rect.x + "px",
        rect.x + rect.width + 5,
        rect.y + 11
      );
      context.fillText(
        "y: " + rect.y + "px",
        rect.x + rect.width + 5,
        rect.y + 22
      );
    });
  });

  initGUIControllers(tracker, colors[0]);
}
