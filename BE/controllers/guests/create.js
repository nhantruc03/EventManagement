const Guests = require("../../models/guests")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')

const create = async (req, res) => {
  let sessions = []
  try {
    // const query = {
    //   $or: [
    //     {
    //       $and: [
    //         { email: req.body.email },
    //         { guestTypeId: req.body.guestTypeId }
    //       ]
    //     },
    //     {
    //       $and: [

    //         { phone: req.body.phone },
    //         { guestTypeId: req.body.guestTypeId }
    //       ]
    //     }
    //   ]
    //   ,
    //   isDeleted: false
    // } // for oldDocs

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

    // Access DB
    const newDoc = await Guests.create([body], { session: session })

    // Check duplicate
    // const oldDocs = await Guests.find(query, null, { session })
    // if (oldDocs.length > 1) {
    //   await abortTransactions(sessions)
    //   return res.status(406).json({
    //     success: false,
    //     error: "Duplicate data"
    //   })
    // }
    // Success
    await commitTransactions(sessions)
    console.log(newDoc)
    const doc = await Guests.findOne({ _id: newDoc[0]._id, isDeleted: false })
      .populate({ path: 'guestTypeId', select: 'name status' })

    return res.status(200).json({
      success: true,
      data: doc
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