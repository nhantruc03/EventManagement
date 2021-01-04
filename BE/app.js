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
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(busboyBodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/images', express.static('images'));
// Routes
// app.use("/api/medicine-categories", authenticateToken, require("./routes/medicinecategories"));
// app.use("/api/medicines", authenticateToken, require("./routes/medicines"));
// app.use("/api/patients", authenticateToken, require("./routes/patients"));
// app.use("/api/prescriptions", authenticateToken, require("./routes/prescriptions"));
// app.use("/api/prescription-details", authenticateToken, require("./routes/prescriptiondetails"));
// app.use("/api/prescription-bills", authenticateToken, require("./routes/prescriptionbills"));
// app.use("/api/prescription-bill-details", authenticateToken, require("./routes/prescriptionbilldetails"));
// app.use("/api/medical-records", authenticateToken, require("./routes/medicalrecords"));
// app.use("/api/medical-details", authenticateToken, require("./routes/medicaldetails"));
app.use("/api/users", require("./routes/users"))
// app.use("/api/faculties", require("./routes/faculties"))
// app.use("/api/departments", require("./routes/departments"))
// app.use("/api/services", require("./routes/services"))
// app.use("/api/medical-bills", require("./routes/medicalBills"))
// app.use("/api/medical-bill-details", require("./routes/medicalBillDetails"))

// Connect DB then start server
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.rc4jh.mongodb.net/dbOne?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }
  )
  .then( () => {
    console.log("Database connected successfully");
    // app.listen(port, () => {
    //   console.log(`Server is running on port ${port}`);
    // });
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error.message);
  });