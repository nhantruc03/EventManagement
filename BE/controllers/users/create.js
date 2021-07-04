const Users = require("../../models/users")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const bcrypt = require('bcryptjs')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
// const ChatRooms = require("../../models/chatRooms")
// const { isEmpty } = require("lodash")
const create = async (req, res) => {
  let sessions = []
  try {
    const query = {
      $or: [
        { phone: req.body.phone },
        { email: req.body.email },
        { username: req.body.username },
        { mssv: req.body.mssv }
      ],
      isDeleted: false
    } // for oldDocs

    // Handle data
    const { error, body } = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error
      })
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Hash password
    if (body.password != null) {
      body.password = await bcrypt.hashSync(body.password, 10);
    }

    //get List userBefore create
    // const listOldUser = await Users.find().select('_id')

    // Access DB
    const newDoc = await Users.create([body], { session: session })

    // Check duplicate
    const oldDocs = await Users.find(query, null, { session })
    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }

    // //create chatRoom with other users
    // // Handle data
    // let listRoomNeed = [];

    // listOldUser.forEach(e => {
    //   let temp = {
    //     userID1: newDoc[0]._id,
    //     userID2: e._id
    //   }
    //   listRoomNeed.push(temp)
    // })
    // // Access DB
    // // Create
    // const newDoc_Room = await ChatRooms.insertMany(
    //   listRoomNeed,
    //   { session: session }
    // )

    // if (isEmpty(newDoc_Room) || newDoc_Room.length != listRoomNeed.length) {
    //   await abortTransactions(sessions);
    //   return res.status(406).json({
    //     success: false,
    //     error: "Created failed"
    //   });
    // }

    // Success
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: newDoc
    });
  } catch (error) {
    await abortTransactions(sessions)
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { create }