let matches;
let cnv, image_1, image_2, img, img2;

let reso = 16;
let size = 400;

function preload() {
  img = loadImage("images/obama.jpg");
  img2 = loadImage("images/pine_trees.jpeg");
  preview = loadImage("preview.png")
}

function setup() {
  cnv = createCanvas(size, size);
  cnv.parent('morph')

  background(0)

  preview.resize(size, size)
  image(preview, 0, 0)

}

function refreshImages() {

  // set image variables
  let file_input1 = document.getElementById('img_sel_1');
  let file1 = file_input1.files[0];
  let urlOfFile1 = URL.createObjectURL(file1);

  img = imageObject = loadImage(urlOfFile1);

  let file_input2 = document.getElementById('img_sel_2');
  let file2 = file_input2.files[0];
  let urlOfFile2 = URL.createObjectURL(file2);

  img2 =  loadImage(urlOfFile2);

  document.getElementById("morph_button").disabled = null

}

function morph() {
  // process images
  image_1 = processImage(img, reso)
  image_2 = processImage(img2, reso)

  // match partners
  matches = getMatches(image_1[1], image_2[1])

  // draw image 1 with image 2
  paint(matches, image_2[0], reso)
}

function draw() {
  img.resize(size, size)
  img2.resize(size, size)
}

function getGroups(img, res) {
  let groups_ = []

  for (x = 0; x < width; x += res) {
    for (y = 0; y < height; y += res) {

      groups_.push(
        img.get(x, y, res, res)
      )

    }
  }

  return(groups_)

}

function getMatches(avgs1, avgs2) {

  let matches = [];
  let brightness_1 = [];
  let brightness_2 = [];

  for (i = 0; i < avgs1.length; i++) {
    brightness_1[i] = avgs1[i].reduce((a, b) => a + b, 0)
  }

  for (i = 0; i < avgs2.length; i++) {
    brightness_2[i] = avgs2[i].reduce((a, b) => a + b, 0)
  }

  for (i = 0; i < avgs1.length; i++) {
    let distances = []
    let best_match = 5000;
    let index;

    for (j = 0; j < avgs2.length; j++) {
      // find different between group i and j


      distances[j] = abs(brightness_1[i] - brightness_2[j])

      if (distances[j] < best_match) {
        best_match = distances[j];
        index = j;
      }

    }

    matches[i] = index;
  }

  return(matches)

}

function paint(matches, groups_2, res) {

  // draw groups
  let index = 0
  for (x = 0; x < size; x += res) {
    for (y = 0; y < size; y += res) {
      // fill(averages_1[index])
      // noStroke()
      // rect(x, y, reso)
      image(groups_2[matches[index]], x, y)
      index += 1
    }
  }

}

function getAverageColour(group, res) {

  let r = 0
  let g = 0
  let b = 0
  let a = 0

  for (x = 0; x < res; x++) {
    for (y = 0; y < res; y++) {
      let pix = group.get(x, y)
      r += pix[0]
      g += pix[1]
      b += pix[2]
      a += pix[3]
    }
  }
  let total = res*res
  r = r/total
  g = g/total
  b = b/total
  a = a/total

  return([r, g, b, a])
}

function processImage(img, res) {
  // get groups of pixels from image 1
  let groups = getGroups(img, res);

  // find average colour of each group
  let averages = [];
  for (i = 0; i < groups.length; i++) {
    averages[i] =  getAverageColour(groups[i], res)
  }

  return(
    [groups, averages]
  )
}
