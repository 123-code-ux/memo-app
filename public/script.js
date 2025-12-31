const dinos = [
  { name: 'ティラノサウルス', size: 12, img: 'tyrannosaurus.jpg' },
  { name: 'スピノサウルス', size: 18, img: 'spinosaurus.jpg' },
  { name: 'トリケラトプス', size: 9, img: 'triceratops.jpg' },
];

let left, right;

function randomDinos() {
  const a = dinos[Math.floor(Math.random() * dinos.length)];
  let b;
  do { b = dinos[Math.floor(Math.random() * dinos.length)]; } while (b === a);
  left = a;
  right = b;

  document.getElementById('dino1').src = `images/${left.img}`;
  document.getElementById('dino2').src = `images/${right.img}`;
  document.getElementById('result').textContent = '';
}

function answer(side) {
  let correct = left.size > right.size ? 'left' : 'right';
  if (side === correct) {
    document.getElementById('result').textContent = `正解！🎉 ${side === 'left' ? left.name : right.name} が大きい！`;
  } else {
    document.getElementById('result').textContent = `残念！😢 ${side === 'left' ? right.name : left.name} が大きい！`;
  }
}

function nextQuiz() {
  randomDinos();
}

randomDinos();
