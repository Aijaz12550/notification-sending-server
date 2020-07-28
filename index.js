const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const credentials = require("./admin.json");
const app = express();
const port = 4000;


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/test',(req,res)=> res.send({message: "Working..."}))
admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://quiz-tst.firebaseio.com",
});

app.post("/:device/send/notification", (req, res) => {
  let data = req.body;
  let { params } = req;

  let payload = {
    notification: {
      title: data.payload.title,
      body: data.payload.message,
    },
  };

  let token = params.device;

  let options = {
    priority: "high",
    vibration: true,
    sound: true,
  };
  console.log("data", data);
  console.log("param", params);

  admin
    .messaging()
    .sendToDevice(token, payload, options)
    .then((responce) => res.send(responce))
    .catch((err) => res.status(500).send(err));
});

app.listen(port, () => {
  console.log("server is running on port " + port);
});
