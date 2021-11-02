const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// app
const app = express();

const { send } = require('./sendMessage');

// routes middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());



// routes
app.get("/test", (req, res) => {
  res.json({
    state: "successfull",
  });
});

app.post('/send/message',(req,res)=> {
    send(req.body.phone,req.body.message);
    console.log("Body",req.body);
});

// Start SERVER on PORT
const PORT = 8000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`ERROR While Starting Server : ${err}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
