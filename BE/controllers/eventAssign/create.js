const EventAssign = require("../../models/eventAssign")
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { isArray, pick, isEmpty } = require("lodash")
const Events = require('../../models/events');
const create = async (req, res) => {
  let sessions = []
  try {
    const query = {
      $and: [
        { userId: req.body.userId },
        { eventId: req.body.eventId }
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

    // Create
    const newDoc = await EventAssign.create(
      [body],
      { session: session }
    )

    // Check duplicate
    const oldDocs = await EventAssign.find(query, null, { session })
    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }
    // update Avail User
    const event = await Events.findOne({ _id: newDoc[0].eventId, isDeleted: false })

    let data = [...event.availUser, newDoc[0].userId.toString()]


    const updated = await Events.findOneAndUpdate(
      { _id: newDoc[0].eventId, isDeleted: false },
      { availUser: data },
      { new: true }
    )

    // Success

    await commitTransactions(sessions)
    const doc = await EventAssign.findOne({ _id: newDoc[0]._id, isDeleted: false })
      .populate("userId")
      .populate("eventId")
      .populate({ path: 'roleId', select: 'name' })
      .populate({ path: 'userId', select: 'name phone email' })
      .populate({ path: 'facultyId', select: 'name' })

    return res.status(200).json({
      success: true,
      data: doc,
      updated: updated
    });
  } catch (error) {
    await abortTransactions(sessions);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { create }