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

function turnOn() {
  if(!on) {
    turnOnButton.innerHTML = 'Turn off';
    publishConfig.message = 10;
    on = true;
  } else {
    turnOnButton.innerHTML = 'Turn on';
    publishConfig.message = 1
    on = false;
  }

  pubnub.publish(publishConfig);
}

function heatUp() {
  if(publishConfig.message < 30) {
    publishConfig.message += 10;
  }

  pubnub.publish(publishConfig);
}

function coolDown() {
  if(publishConfig.message > 11) {
    publishConfig.message -= 10;
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
    growTimeHeader.innerHTML = `Grow Time: ${4000 - parseInt(message.message)}`
  }
})

pubnub.subscribe({
  channels: ['time']
});
