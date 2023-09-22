const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        headless: false
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('auth_failure', () => {
    console.log('auth_failure');
});

client.on('ready', () => {
    console.log('READY OR NOT, HERE I COME!');
    clientStatus= true
  });
  
client.on('authenticated',()=>{
console.log('authentication succesfully. Yes')
})

client.on('auth_failure',(message)=>{
console.log('auth failure reason being that ', message)
})

client.on('disconnected', ()=>{
console.log('client is disconnected')
clientStatus=false
})
  


client.on('message', message => {
	console.log(message.body);
});




client.initialize();
