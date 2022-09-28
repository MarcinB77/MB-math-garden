var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json')
}

function predictImage() {
  // console.log('processing...');

  let image = cv.imread(canvas);
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  image = image.roi(rect);

  var height = image.rows;
  var width = image.cols;

  if (height > width) {
    const scaleFactor = height / 20;
    height = 20;
    width = Math.round(width / scaleFactor);
  } else {
    const scaleFactor = width / 20;
    width = 20;
    height = Math.round(height / scaleFactor);
  };

  let newSize = new cv.Size(width, height);
  cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

  const LEFT = Math.ceil(4 + (20 - width) / 2);
  const RIGHT = Math.floor(4 + (20 - width) / 2);
  const TOP = Math.ceil(4 + (20 - height) / 2);
  const BOTTOM = Math.floor(4 + (20 - height) / 2);

  // console.log(`top=${TOP} bottom=${BOTTOM} left=${LEFT} right=${RIGHT}`);

  const BLACK = new cv.Scalar(0, 0, 0, 0);
  cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

  // Center of mass:
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);
  const Moments = cv.moments(cnt, false);

  const cx = Moments.m10 / Moments.m00;
  const cy = Moments.m01 / Moments.m00;

  // console.log(Moments.m00, cx, cy);

  const X_SHIFT = Math.round(image.cols/2 - cx);
  const Y_SHIFT = Math.round(image.rows/2 - cy);

  // Shifting using center of mass
  newSize = new cv.Size(image.rows, image.cols);
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
  cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);


  // Normalize data
  let pixelValues = image.data;

  pixelValues = Float32Array.from(pixelValues);

  pixelValues = pixelValues.map(function(item){
      return item / 255.0;
  });

  // Creating a tensor
  const X = tf.tensor([pixelValues]);
  // console.log(X.shape);
  // console.log(X.dtype);

  // Prediction

  const result = model.predict(X);
  result.print();

  const output = result.dataSync()[0];

  // console.log(tf.memory);

  // testing only...
  // const outputCanvas = document.createElement('CANVAS');
  // cv.imshow(outputCanvas, image);
  // document.body.appendChild(outputCanvas);

  // Clean Up
  image.delete();
  contours.delete();
  hierarchy.delete();
  cnt.delete();
  M.delete();
  X.dispose();
  result.dispose();

  return output;
}
