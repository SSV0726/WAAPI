const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client();

// Get QR code to scan WhatsAPP
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('message', message => {
    console.log(message.body);
});

// List of data for automatic Reply
var data = [
{ id: 1, received: 'Hello', reply: 'Hi Bruhhhh'},
{ id: 2, received: 'Hey', reply: 'Hey Whats up?'},
{ id: 3, received: 'hello', reply: 'hellooo!'},
{ id: 4, received: 'Sorry', reply: 'OKIE NO PROBLEM'},
{ id: 5, received: 'Can we have a call?', reply: 'Please leave a voicemail. Let us connect in an hour. Kind Reards, Bharath Chippa'},
{ default: 'Please leave a voicemail. Let us connect in an hour. Kind Reards, Bharath Chippa' }
];

client.on('message', message => {
  var selectedData = data.find((msg) => {
  if(msg.received === message.body) {
    return true
  }
});

var sourceMsg, targetMsg;
if(selectedData && Object.keys(selectedData).length !== 0 && selectedData.constructor === Object) {
  sourceMsg = selectedData.received;
  targetMsg = selectedData.reply;
}

// test data
// const sourceMsg = 'Hello';
// const targetMsg = 'I am occupied at present. You can leave me SMS here, will call you shortly.';

// Send message
if(message.body === sourceMsg) {
  message.reply(targetMsg);
} else {
  message.reply(data.default);
}
});

client.initialize();