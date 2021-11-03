const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { Buffer } = require('buffer');
const { Client , MessageMedia} = require('whatsapp-web.js');
const client = new Client();
var request = require('request').defaults({ encoding: null });


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// async function getBase64(url) {
//     return Buffer.from(
//       (await axios.get(url, {
//         responseType: 'arraybuffer'
//       })).data, 'binary').toString('base64');
// }

async function send(chatId){
    // const response = await axios.get('https://picsum.photos/seed/picsum/200/300', {
    //     responseType: "arraybuffer"
    //   });
    // var media = await MessageMedia(('image/webp',Buffer.from(response).data,'binary').toString('base64'));
    // console.log("media",media);


   

    // const response = await axios.get('https://picsum.photos/seed/picsum/200/300');
    // const buffer = await response.buffer()

    imageToBase64('https://picsum.photos/200/300') // Image URL
        .then( async (response2) => {
           const media = new MessageMedia('jpeg', response2);
           var response = await client.sendMessage(chatId, media, {caption: 'new image'});
           console.log('rres',response);
         })

    // const url = "https://picsum.photos/seed/picsum/200/300";
    // const image = await axios.get(url, {responseType: 'arraybuffer'});
    // const raw = Buffer.from(image.data).toString('base64');
    // const base64Image = "data:" + image.headers["content-type"] + ";base64,"+raw;

    // var text = 'this is a bot text';
    // console.log("log", chatId);
    
}

client.on('ready', () => {
    console.log('Client is ready!');
    send('919372220540@c.us');
});
	
client.initialize();