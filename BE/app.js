const express = require('express')
const fs = require('fs');
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
const users = {};

const socketToRoom = {};
wsServer.on('request', function (request) {
  var userID = getUniqueID();
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      const dataFromClient = JSON.parse(message.utf8Data);
      switch (dataFromClient.type) {
        case 'join room':
          const roomID = dataFromClient.message
          if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
              let result = JSON.stringify({
                type: 'room full'
              })
              for (key in clients) {
                clients[key].sendUTF(result);
              }
              break;
            }
            users[roomID].push(userID);
          } else {
            users[roomID] = [userID];
          }
          socketToRoom[userID] = roomID;
          const usersInThisRoom = users[roomID].filter(id => id !== userID);
          let result = JSON.stringify({
            type: 'all users',
            message: usersInThisRoom,
            currentId: userID
          })
          for (key in clients) {
            if (key === userID) {
              clients[key].sendUTF(result);
            }

          }
          break;
        case 'sending signal':
          let userToSignal = dataFromClient.message.userToSignal
          let signal = dataFromClient.message.signal
          let callerID = dataFromClient.message.callerID
          let result2 = JSON.stringify({
            type: 'user joined',
            message: {
              signal: signal,
              callerID: callerID
            }
          })
          for (key in clients) {
            if (key === userToSignal) {
              clients[key].sendUTF(result2);
            }
          }
          break;
        case 'returning signal':
          let signal2 = dataFromClient.message.signal
          let callerID2 = dataFromClient.message.callerID
          let result3 = JSON.stringify({
            type: 'receiving returned signal',
            message: {
              signal: signal2,
              id: userID
            }
          })
          for (key in clients) {
            if (key === callerID2) {
              clients[key].sendUTF(result3);
            }
          }
          break;
        default:
          for (key in clients) {
            clients[key].sendUTF(message.utf8Data);
          }
          break;
      }
    }
  })

  connection.on('close', function (connection) {
    const roomID = socketToRoom[userID];
    let room = users[roomID];
    if (room) {
      console.log('leaver', userID)
      let result = JSON.stringify({
        type: 'user disconnected',
        message: userID
      })

      room = room.filter(id => id !== userID);
      users[roomID] = room;
      room.forEach(e => {
        clients[e].sendUTF(result);
      })
      // for (key in clients) {
      //   clients[key].sendUTF(result);

      // }
    }
    delete clients[userID];
  });
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
app.use('/api/resources', express.static('resources'));
// Routes
// app.use("/api/medicines", authenticateToken, require("./routes/medicines"));
app.use("/api/users", require("./routes/users"));
app.use("/api/actions", require("./routes/actions"));
app.use("/api/sub-actions", require("./routes/subActions"));
app.use("/api/action-tags", require("./routes/actionTags"));
app.use("/api/action-priorities", require("./routes/actionPriorities"));
app.use("/api/action-types", require("./routes/actionTypes"));
app.use("/api/event-types", require("./routes/eventTypes"));
app.use("/api/events", require("./routes/events"));
app.use("/api/tags", require("./routes/tags"));
app.use("/api/action-assign", require("./routes/actionAssign"));
app.use("/api/action-resources", require("./routes/actionResources"));
app.use("/api/event-assign", require("./routes/eventAssign"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/system-roles", require("./routes/systemRoles"));
app.use("/api/credentials", require("./routes/credentials"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/chat-message", require("./routes/chatMessages"));
app.use("/api/scripts", require("./routes/scripts"));
app.use("/api/script-details", require("./routes/scriptDetails"));
app.use("/api/guests", require("./routes/guests"));
app.use("/api/guest-types", require("./routes/guestTypes"));
app.use("/api/faculties", require("./routes/faculties"));
app.use("/api/notifications", require("./routes/notifications"));


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



app.post("/api/upload-resources/:id", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // console.log(req)
  let sampleFile = req.files.file;
  console.log(req.files.file)
  let extension = mime.extension(sampleFile.mimetype);
  const uniqueSuffix = Date.now()
  let filename = uniqueSuffix + '-' + req.files.file.name;
  // Use the mv() method to place the file somewhere on your server
  if (!fs.existsSync(`./resources/${req.params.id}`)) {
    fs.mkdirSync(`./resources/${req.params.id}`);
  }
  sampleFile.mv(`./resources/${req.params.id}/` + filename, function (err) {
    if (err)
      return res.status(500).send(err);
    res.status(200).json({
      uploaded: true,
      url: filename,
      extension: extension
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