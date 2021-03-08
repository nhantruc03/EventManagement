const EventAssign = require("../../models/eventAssign")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { isArray, pick, isEmpty } = require("lodash")

const create = async (req, res) => {
  let sessions = []
  try {
    const query = {
      $and: [
        { name: req.body.name },
        { eventID: req.body.eventID }
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

    // Success
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: newDoc
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