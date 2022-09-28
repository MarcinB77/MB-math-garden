var answer;
var score = 0;
var backgroundImages = [];

function displayImages() {
  document.body.style.backgroundImage = backgroundImages;
}

function nextQuestion() {
  const n1 = Math.floor(Math.random() * 5);
  document.getElementById('n1').innerHTML = n1;
  const n2 = Math.floor(Math.random() * 6);
  document.getElementById('n2').innerHTML = n2;
  answer = n1 + n2;
}

function checkAnswer() {
  if (predictImage() == answer) {
    score++;
    if (score <= 6) {
      backgroundImages.push(`url('images/background${score}.svg')`);
      displayImages();
    } else {
      alert('Congratulations!')
      score = 0;
      backgroundImages = [];
      displayImages();
    };
  } else {
    alert('Wrong Answer');
    if (score > 0) {
      score--;
      backgroundImages.pop();
      setTimeout(() => {displayImages()}, 1000);
    };
  };
  console.log(score);
}
