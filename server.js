"use strict"

const cors        = require("cors");
const path        = require("path");
const morgan      = require("morgan");
const express     = require("express");
const bodyParser  = require("body-parser");
const whatsapp    = require('./whatsapp');
const dotenv      = require("dotenv").config({ path : path.join( __dirname  , ".env") });


const app = express();
app.use(morgan("dev"));
app.use(cors());


//##################################################//
//                    Routes                        //
//##################################################//
app.get("/", (req, res) => {
  res.json({
    status  : "success",
    message : "API is working !!",
  });
});

app.get("/api", (req, res) => {
  res.json({
    status  : "success",
    message : "API is working !!",
  });
});

app.get("/api/qrcode", (req, res) => {
  res.json({
    status  : "success",
    data    :  whatsapp.getQRcode(),
    url     : "https://4qrcode.com/#text",
  });
});

app.get("/api/whatsapp/status", (req, res) => {
  res.json({
    status  : "success",
    data    :  whatsapp.getClientStatus(),
    url     : "https://4qrcode.com/#text",
  });
});

app.post('/api/send/message',(req,res)=> {
  try{

    send(req.body.phone,req.body.message);
    console.log("Body",req.body);

  }catch(err){
    res.json({ 
      status  : "error",
      message : err 
    });
  }
   
});


//##################################################//
//                    SERVER                        //
//##################################################//
const PORT = process.env.PORT || 4006;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`ERROR While Starting Server : ${err}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
