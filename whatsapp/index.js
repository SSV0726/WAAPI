const { Client , MessageMedia , Location } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const imageToBase64 = require('image-to-base64');
const client = new Client();


let QR_code_data     = "";
let WA_client_status = false;

// Get QR code to scan WhatsAPP
client.on('qr', qr => {   
    QR_code_data = qr;
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {    
    console.log('Client is ready!');
    WA_client_status = true;    
});

const replies = {
     'bot status' : "Hi , BOT is working 😃. ",
     'hi'         : "Hey Whats up?            ",
     'hello'      : "hellooo!                 ",
     'sorry'      : "NO PROBLEM 😃           ",
};

client.on('message', message => {
    console.log(message.from , " : " , message.body ); 

    let msgRecieved = message.body.toLocaleLowerCase();
    if( replies[msgRecieved] != undefined ){
        message.reply(replies[msgRecieved]);
    }  
});

client.initialize();

//##################################################//
//                    Functions                     //
//##################################################//

function sendMessage(mobile,message){

    let chatId;

    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    if( isNaN(parseInt(mobile[0])) ){
         chatId = mobile.slice(1) +  "@c.us"; // chatID is used for sending messages
    }else{
         chatId = mobile + "@c.us";
    }
    console.log("sendMessage(",mobile,message,")");
    
    return new Promise((resolve,reject)=>{
         // Sending message.
        client.isRegisteredUser(chatId).then(function(isRegistered) {
            if(isRegistered) {
                client.sendMessage(chatId, message);
                resolve(" Sent ");
            }else{
                reject(" Not a registered User !!");
            }
        });  
    });
}

function sendLocation(mobile,lat,long,desc){

    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    if( isNaN(parseInt(mobile[0])) ){
        mobile = mobile.slice(1) +  "@c.us";
    }else{
        mobile = mobile + "@c.us";
    }
    console.log("sendMessage(",mobile,lat,long,desc,")");

    let chatId = mobile;   // chatID is used for sending messages

    var location = new Location(lat, long, desc);
    
    return new Promise((resolve,reject)=>{
         // Sending message.
        client.isRegisteredUser(chatId).then(function(isRegistered) {
            if(isRegistered) {
                client.sendMessage(chatId, location);
                resolve(" Sent ");
            }else{
                reject(" Not a registered User !!");
            }
        });  
    });
}


async function sendImage(mobile, url, caption){

     // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    if( isNaN(parseInt(mobile[0])) ){
        mobile = mobile.slice(1) +  "@c.us";
    }else{
        mobile = mobile + "@c.us";
    }
    
    console.log("sendMedia(",mobile,url,caption,")");

    let chatId = mobile;   // chatID is used for sending messages
    
    return new Promise((resolve,reject)=>{

        imageToBase64(url) // convert image to Base64 string
        .then( async (response2) => {
            const media = new MessageMedia('image/jpeg', response2);
            await client.isRegisteredUser(chatId).then(function(isRegistered) {
                if(isRegistered) {
                    client.sendMessage(chatId, media, {caption});
                    resolve(" Sent ");
                } else {
                    reject(" Not a registered User !!");
                }
            })
         })
         .catch((err)=>{
             console.log("error",err);
             reject(" Error ");
         })
    });

}


function getQRcode(){
    return QR_code_data;
}

function getClientStatus(){
    return WA_client_status;
}

module.exports['sendMessage']     = sendMessage;
module.exports['sendLocation']    = sendLocation;
module.exports['sendImage']       = sendImage;
module.exports['getQRcode']       = getQRcode;
module.exports['getClientStatus'] = getClientStatus;