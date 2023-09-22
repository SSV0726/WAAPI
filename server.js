require("dotenv").config();
const cors        = require("cors");
const morgan      = require("morgan");
const fs = require('fs');
const express     = require("express");
const { Client, LocalAuth, MessageMedia, Location} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(morgan("dev"));
app.use(cors());

let clientStatus= false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    headless: false,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
  }
});

client.initialize();

//##################################################//
//                    Functions                     //
//##################################################//

function convertTochatId(mobile){
  if( isNaN(parseInt(mobile[0])) ){
    chatId = mobile.slice(1) +  "@c.us"; // chatID is used for sending messages
  }else{
      chatId = mobile + "@c.us";
  }
  // console.log({chatId})
  return chatId
}

async function checkUser(mobile){
  let chatId;
  chatId= convertTochatId(mobile)
  // console.log(chatId)
  const validClient= await client.isRegisteredUser(chatId)
  if(!validClient){
    console.log('not one')
    throw "Not a registered User"
    
  }
  // console.log(validClient)
  return chatId
}

async function sendMessage(mobile,message){
  console.log("sendMessage(",mobile,message,")");
  const recipient = await checkUser(mobile)
  const msg     = await client.sendMessage(recipient, message)
  return msg
}

async function sendMedia(mobile, imageUrl, caption){
  console.log("sendMedia(",mobile,imageUrl, caption,")");
  const recipient= await checkUser(mobile)
  const media = await MessageMedia.fromUrl(imageUrl);
  const msg= await client.sendMessage(recipient,media,{caption});
  return msg
}

async function sendLocation(mobile,lat,long,desc){
  console.log("sendLocation(",mobile,lat,long,desc,")");
  const recipient= await checkUser(mobile)
  const location= new Location(lat, long, desc)
  const msg= await client.sendMessage(recipient,location);
  return msg
}

async function createGroup(title, participants=[]){
  let b=await client.getContactById(convertTochatId(participants[0]))
  console.log({b})
  // const members=participants.map(mobile=>await client.getContactById(convertTochatId(mobile)))
  // console.log(members)
  const group=await client.createGroup(title,[convertTochatId(participants[0])])
  return group
}

async function getCommonGroups(mobile){
  const contactId= convertTochatId(mobile)
  const contact= await client.getContactById(contactId)
  if(!contact) throw 'Contact does not exist'
  const commongroups= await client.getCommonGroups(contact.id._serialized)
  return commongroups
}


//##################################################//
//                  Automation                      //
//##################################################//


client.on('qr', qr => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true }); // Add this line
  app.get("/api/qrcode", (req, res) => {
    return res.json({
      status:"successfull",
      qr
    })
  });
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


client.on('message', async (message) => {

    console.log(message.from , " : " , message.body ); 
    if (message.body.toLowerCase() == 'hi'){
        await message.reply('Thanks for your messages.\nHow can we help you 😃. ')
        await client.sendMessage(to, new Buttons('Body text/ MessageMedia instance', [{id:'customId',body:'button1'},{body:'button2'},{body:'button3'},{body:'button4'}], 'Title here, doesn\'t work with media', 'Footer here'), {caption: 'if you used a MessageMedia instance, use the caption here'});
        await client.sendMessage(to, new List('Body text/ MessageMedia instance', 'List message button text', [{title: 'sectionTitle', rows: [{id: 'customId', title: 'ListItem2', description: 'desc'}, {title: 'ListItem2'}]}], 'Title here, doeswork with media', 'Footer here'), {caption: 'if you used a MessageMedia instance, use the caption here'});
    }
});


//##################################################//
//                    Routes                        //
//##################################################//

app.get("/", (req, res) => {
  res.json({
    status  : "success",
    message : "API is working !!",
  });
});

app.get('/api/whatsapp/status', async(req,res)=>{
  return res.json({
    online:clientStatus
  })
})
 
app.post('/api/send/message',async(req,res)=> {
  try { 
    console.log("Body shou",req.body);

    let msgBody = "*" + req.body.subject + "* \n \n " + req.body.message + ".";

    const message =await sendMessage(req.body.phone,msgBody);
    return res.json({
      status:"success",
      message
    })
  } catch(err) {
    console.log("Body",req.body);
    console.log(err)
    return res.json({ 
      status  : "error",
      message : err 
    });
  }
});

app.post('/api/send/location',async(req,res)=> {
  try { 
    console.log("Body",req.body);
    const location=await sendLocation(req.body.phone,req.body.latitude,req.body.longtitude,req.body.description);
    return res.json({
      status:'successful',
      location
    })

  } catch(err) {

    console.log("Body",err);
    res.json({ 
      status  : "error",
      message : err
    });
  }
});

app.post('/api/send/image', async(req,res)=> {
  try { 
    console.log("Body",req.body);
    const media = await sendMedia(req.body.phone, req.body.mediaUrl ,req.body.caption);
    return res.json({
      status:'successful',
      media
    })
  } catch(err) {
    console.log("Body",req.body);
    res.json({ 
      status  : "error",
      message : err 
    });
  }
});

// create group
app.post('/api/create/group', async(req,res)=> {
  try { 
    console.log("Body",req.body);
    const group=await createGroup(req.body.title, req.body.participants);
    return res.json({
      status:'successful',
      group
    })
  } catch(err) {
    console.log({err});
    res.json({ 
      status  : "error",
      message : err 
    });
  }
});

//set display name (not succesfull)
app.post('/api/change/displayname', async(req,res)=> {
  try { 
    console.log("Body",req.body);
    const hasChanged=await client.setDisplayName(req.body.displayName);
    return res.json({
      status:hasChanged?'successful':'unsuccesful',
      hasChanged
    })
  } catch(err) {
    console.log("Body",req.body);
    res.json({ 
      status  : "error",
      message : err 
    });
  }
});

//set status (working)
app.post('/api/set/status', async(req,res)=> {
  try { 
    console.log("Body",req.body);
    const status=await client.setStatus(req.body.status);
    console.log(status)
    return res.json({
      status:'successfully set status'
    })
  } catch(err) {
    console.log("Body",req.body);
    res.json({ 
      status  : "error",
      message : err 
    });
  }
});

//get common groups(contactId) with a mobile
app.get('/api/groups/:mobile', async(req,res)=> {
  try { 
    // participant.id._serialized
    const {mobile}= req.params
    const commonGroups=await getCommonGroups(mobile);
    // "234 8105463507@c.us"
    return res.json({
      status:'successful',
      commonGroups
    })
  } catch(err) {
    console.log({err});
    res.json({ 
      status  : "error",
      message : err 
    });
  }
});

//search messages(query,options{page, limit}) (working)
app.get('/api/messages', async(req,res)=> {
  try { 
    const {query="", page=3, limit=5}=req.query
    // participant.id._serialized
    const messages=await client.searchMessages(query,{page,limit});
    return res.json({
      status:'successful',
      messages
    })
  } catch(err) {
    console.log("Body",req.body);
    res.json({ 
      status  : "error",
      message : err 
    });
  }
});

//get logout (working)
app.get('/api/logout', async(req,res)=> {
  try { 
    // participant.id._serialized
    await client.logout();
    clientStatus=false
    return res.json({
      status:'successfully logged out',
      online: clientStatus
      
    })
  } catch(err) {
    console.log("Body",req.body);
    res.json({ 
      status  : "error",
      message : err 
    });
  }
});


//##################################################//
//                    SERVER                        //
//##################################################//
const PORT = process.env.PORT || 5002;

app.listen(PORT, (err) => {
  if (err) {
    console.error(`ERROR While Starting Server : ${err}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
