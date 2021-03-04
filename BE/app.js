const express = require('express')
var path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
const dotenv = require("dotenv");
const helmet = require('helmet');
var busboyBodyParser = require('busboy-body-parser');
const { authenticateToken } = require("./services/authenticationToken")
const app = express()
const port = process.env.PORT || 3001
const fileUpload = require('express-fileupload');
var mime = require('mime');
// about WebSocket
const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer(app);
const clients = {};
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
}

const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function (request) {
  var userID = getUniqueID();
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
      }
    }
  })
})
// about WebSocket

// Config
dotenv.config()
app.use(fileUpload());
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(busboyBodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/images', express.static('images'));
// Routes
// app.use("/api/medicines", authenticateToken, require("./routes/medicines"));
app.use("/api/users", require("./routes/users"));
app.use("/api/actions", require("./routes/actions"));
app.use("/api/event-types", require("./routes/eventTypes"));
app.use("/api/events", require("./routes/events"));
app.use("/api/tags", require("./routes/tags"));
app.use("/api/action-assign", require("./routes/actionAssign"));
app.use("/api/event-assign", require("./routes/eventAssign"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/credentials", require("./routes/credentials"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/chat-message", require("./routes/chatMessages"));
app.use("/api/scripts", require("./routes/scripts"));
app.use("/api/script-details", require("./routes/scriptDetails"));
app.use("/api/guests", require("./routes/guests"));
app.use("/api/guest-types", require("./routes/guestTypes"));
app.use("/api/faculties", require("./routes/faculties"));


app.post("/api/uploads", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // console.log(req)
  let sampleFile = req.files.file;
  let extension = mime.extension(sampleFile.mimetype);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  let filename = uniqueSuffix + '-image.' + extension;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./images/' + filename, function (err) {
    if (err)
      return res.status(500).send(err);
    res.status(200).json({
      uploaded: true,
      url: filename,
    });
  });

})
// Connect DB then start server
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.rc4jh.mongodb.net/dbOne?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("Database connected successfully");
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error.message);
  });