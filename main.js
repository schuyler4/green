var pubnub = new PubNub({
  publishKey : 'pub-c-23e37d2c-1259-4959-8a9b-c303af9e881b',
  subscribeKey : 'sub-c-d9205c58-1d69-11e7-894d-0619f8945a4f'
});

let on = false;

let firstAlge = [0, 0, 0, 0];
let secoundAlge = [0, 0, 0, 0];

const publishConfig = {
  channel: 'green',
  message: 1
};

const scales = [
  document.getElementById('red-scale'),
  document.getElementById('orange-scale'),
  document.getElementById('yellow-scale'),
  document.getElementById('blue-scale')
];

let index = 3;

function changeScale(index) {
  for(s of scales) {
    s.innerHTML = '';
  }
  scales[index].innerHTML = '<h1 class="text" id="star" >*</h1>';
}

changeScale(index);

function turnOn() {
  if(!on) {
    turnOnButton.innerHTML = 'Turn off';
    publishConfig.message = 10;
    on = true;
    index -= 1;
    changeScale(index);
  } else {
    turnOnButton.innerHTML = 'Turn on';
    publishConfig.message = 1
    on = false;
    index += 1;
    changeScale(index);
  }

  console.log('should have poblished')
  pubnub.publish(publishConfig);
}

function heatUp() {
  if(publishConfig.message < 30) {
    publishConfig.message += 10;
  }

  if(index > 0 && on) {
    index -= 1;
    changeScale(index);
  }

  pubnub.publish(publishConfig);
}

function coolDown() {
  if(publishConfig.message > 11) {
    publishConfig.message -= 10;
  }

  if(index < 2 && on) {
    index += 1;
    changeScale(index);
  }

  pubnub.publish(publishConfig);
}

let message = 'plant';

function plant() {
  const plantConfig = {
    channel: 'farm',
    message
  };

  pubnub.publish(plantConfig);

  if(message === 'plant') {
    message = 'harvest';
  } else if(message === 'harvest') {
    message = 'plant';
    growTimeHeader.innerHTML = 'Grow Time:';
  }
  plantButton.innerHTML = message;
}

const turnOnButton = document.getElementById('turn-on-button');
const heatUpButton = document.getElementById('heat-up-button');
const coolDownButton = document.getElementById('cool-down-button');
const plantButton = document.getElementById('plant-button');

turnOnButton.addEventListener('click', turnOn);
heatUpButton.addEventListener('click', heatUp);
coolDownButton.addEventListener('click', coolDown);
plantButton.addEventListener('click', plant);


const growTimeHeader = document.getElementById('grow-time');

pubnub.addListener({
  message(message) {
    growTimeHeader.innerHTML = `Grow Time: ${4000 - parseInt(message.message)}`;
  }
})

pubnub.subscribe({
  channels: ['time']
});

const problemsHeader = document.getElementById('problems-header');

const possibleProblems = ['it exploded',
'it', 'the furnace will not work', 'the heat is not hot']

let problems = []

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function findProblems() {
  const firstRandom = getRandomInt(0, 1000);
  const secoundRandom = getRandomInt(0, 1000);

  if(firstRandom === secoundRandom) {
    problems.push(possibleProblems[getRandomInt(0, 2)]);
    for(problem of problems) {
      problemsHeader.innerHTML += '\n' + problem + '\n';
    }
  }
}

const energyInputHeader = document.getElementById('energy-input-header');
const energyOutputHeader = document.getElementById('energy-output-header');

function getInputAndOutput() {
  energyInputHeader.innerHTML = `Energy Input: ${getRandomInt(30, 40)}`;
  energyOutputHeader.innerHTML = `Energy Output: ${getRandomInt(40, 50)}`;
}

setInterval(() => {
  getInputAndOutput()
}, 10);
