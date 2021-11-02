const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client();

// Get QR code to scan WhatsAPP
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

function send(phone,message){
 console.log("This is in function!");
  //  const number = "+918459953212";
 
  // Your message.
  //  const text = "this is text";

  //  const {phone,message}  = req.body;

  // Getting chatId from the number.
  // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
 const chatId = "91" + phone + "@c.us";

 console.log("parrams",phone,chatId,message);

 // Sending message.
 client.isRegisteredUser(chatId).then(function(isRegistered) {
    if(isRegistered) {
        client.sendMessage(chatId, message);
    }
 })  
}

// function loop(){
//     setInterval(send, 3000);
// }

client.on('ready', () => {
 console.log('Client is ready!');
 //  loop();
 });

client.initialize();
module.exports['send'] = send;