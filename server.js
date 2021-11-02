"use strict"

const cors        = require("cors");
const path        = require("path");
const morgan      = require("morgan");
const express     = require("express");
const bodyParser  = require("body-parser");
const { send }    = require('./wweb/sendMessage');
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
