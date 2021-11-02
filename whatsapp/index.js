const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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

    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    if( isNaN(parseInt(mobile[0])) ){
        mobile = mobile.substring(1) +  "@c.us";
    }else{
        mobile = mobile + "@c.us";
    }

    let chatId = mobile;   // chatID is used for sending messages
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



function getQRcode(){
    return QR_code_data;
}

function getClientStatus(){
    return WA_client_status;
}

module.exports['sendMessage']     = sendMessage;
module.exports['getQRcode']       = getQRcode;
module.exports['getClientStatus'] = getClientStatus;