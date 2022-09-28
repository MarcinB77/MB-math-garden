const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 12;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;


function prepareCanvas() {
  // console.log('Preparing Canvas...');
  canvas = document.getElementById('my-canvas');
  context = canvas.getContext('2d');

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.strokeStyle = LINE_COLOR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = 'round';

  var isPaintig = false;

  function draw() {
    if (isPaintig == true) {
      context.beginPath();
      context.moveTo(previousX, previousY);
      context.lineTo(currentX, currentY);
      context.closePath();
      context.stroke();
    };
  }

  document.addEventListener('mousedown', function(event) {
    isPaintig = true;
  });

  document.addEventListener('touchstart', function(event) {
    previousX = currentX;
    currentX = event.touches[0].clientX - canvas.offsetLeft;

    previousY = currentY;
    currentY = event.touches[0].clientY - canvas.offsetTop;
    isPaintig = true;
  });

  document.addEventListener('mouseup', function(event) {
    isPaintig = false;
  });

  document.addEventListener('touchend', function(event) {
    isPaintig = false;
  });

  canvas.addEventListener('mouseleave', function(event) {
    isPaintig = false;
  });

  canvas.addEventListener('mouseleave', function(event) {
    isPaintig = false;
  });

  canvas.addEventListener('mousemove', function(event) {
    previousX = currentX;
    currentX = event.clientX - canvas.offsetLeft;

    previousY = currentY;
    currentY = event.clientY - canvas.offsetTop;

    draw();
  });

  canvas.addEventListener('touchmove', function(event) {
    previousX = currentX;
    currentX = event.touches[0].clientX - canvas.offsetLeft;

    previousY = currentY;
    currentY = event.touches[0].clientY - canvas.offsetTop;

    draw();

  });

};

function clearCanvas() {
  currentX = 0;
  currentY = 0;
  previousX = 0;
  previousY = 0;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}
