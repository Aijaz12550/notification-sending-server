const express = require("express");
const app = express();
var cors = require("cors");
const admin = require("firebase-admin");
const credentials = require("./admin.json");
app.use(cors());
admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://quiz-tst.firebaseio.com",
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.listen(process.env.PORT || 8000, function () {
  console.log("server is listening");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/test", (req, res) => res.send({ message: "Working..." }));

app.post("/:device/send/notification", (req, res) => {
  console.log("===--");
  let data = req.body;
  let { params } = req;

  let payload = {
    notification: {
      title: data.payload.title,
      body: data.payload.message,
    },
  };

  let token = params.device;
  console.log("===>", payload, token);

  let options = {
    priority: "high",
    vibration: true,
    sound: true,
  };
  console.log("data", data);
  console.log("param", params);
  console.log("payload", payload);
  admin
    .messaging()
    .sendToDevice(token, payload, options)
    .then((responce) => {
      console.log("res", responce);
      res.send(responce);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send(err);
    });
});
app.use("/", (req, res) => {
  console.log("==");
  res.send({ message: "WelCome to server" });
});

// app.get('/test', (req, res) => {
//     res.send({message: "Worked"})
// })

// app.get('/getAllFriends', (req, res) => {
//     console.log('hello world')
//     res.send({users: [], message: 'successful'})
// })

// app.post('/addFriend', (req, res) => {
//     console.log('hello world')
//     res.send({message: 'friend added'})
// })
