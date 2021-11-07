const qrcode = require('qrcode-terminal');
const {Client, Location } = require('whatsapp-web.js');
const client = new Client();
const imageToBase64 = require('image-to-base64');

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    // loop(); 
});

client.on('message', async message => {
	let chat = await message.getChat()
    console.log(chat.id._serialized , chat.name , message.body) 
    if(chat.id._serialized === '917977789547-1599546567@g.us'){
        client.sendMessage('917977789547-1599546567@g.us', 'CITY TILL I DIE!')
    }
});

	
client.initialize();