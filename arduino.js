const five = require('johnny-five');
const PubNub = require('pubnub');

const board = new five.Board();

const pubnub = new PubNub({
  publishKey : 'pub-c-23e37d2c-1259-4959-8a9b-c303af9e881b',
  subscribeKey : 'sub-c-d9205c58-1d69-11e7-894d-0619f8945a4f'
})

board.on('ready', () => {
  const led = new five.Led(6);

  pubnub.addListener({
    message(message) {
      if(message.channel === 'green') {
        console.log(message);
        if(parseInt(message.message) === 0) {
          led.off();
          console.log('it is');
        } else {
          led.brightness(parseInt(message.message));
        }
      } else if(message.channel === 'farm' && message.message === 'plant') {
        growing = true;
      } else if(message.channel === 'farm' && message.message === 'harvest') {
        growing = false;
        counter = 0;
        farmGrown = 0;
        for(i = 0; i < 4; i++) {
          farm1[i].off();
          farm2[i].off();
        }
      }
    }
  });

  pubnub.subscribe({
    channels: ['green', 'farm']
  });

  let farmGrown = 0;
  let farm1 = new five.Leds([13, 12, 11, 10]);
  let farm2 = new five.Leds([5,4,3,2]);
  let counter = 0;
  let growing = false;
  let doneGrowing = false;

  setInterval(function() {
    if(growing && counter < 4001) {
      counter += 1

      const publishConfig = {
        channel: 'time',
        message: counter
      }

      pubnub.publish(publishConfig);

      for(i = 0; i < farmGrown; i++) {
        farm1[i].on()
        farm2[i].on()
      }

      if(counter % 1000 === 1 && counter !== 1) {
        farmGrown += 1;
      }
    }
  }, 10);
});
