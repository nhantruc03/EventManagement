const EventAssign = require("../../models/eventAssign")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { isArray, pick, isEmpty } = require("lodash")

const create = async (req, res) => {
  let sessions = []
  try {
    if (isArray(req.body) !== true) {
      return res.status(406).json({
        success: false,
        error: "You must be pass an array"
      });
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Prepare data for Create
    let data = req.body.map(element =>
      pick(element,
        "userId",
        "eventId",
        "role"
      )
    )

    // Create
    const newEventAssign = await EventAssign.insertMany(
      data,
      { session: session }
    )

    if (isEmpty(newEventAssign) || newEventAssign.length != data.length) {
      await abortTransactions(sessions);
      return res.status(406).json({
        success: false,
        error: "Created failed"
      });
    }

    // Check exist
    let findEventAssignMethods = []
    data.forEach(element => {
      findEventAssignMethods.push(
        EventAssign.find({
          userId: element.userId,
          eventId: element.eventId,
          isDeleted: false
        }, null, { session })
      )
    })
    let oldEventAssign = await Promise.all(findEventAssignMethods)

    let checkExist = false;
    let duplicate = [];
    oldEventAssign.forEach(e => {
      if (e.length > 1) {
        duplicate = e;
        checkFail = true
      }
    })
    if (checkExist) {
      await abortTransactions(sessions);
      return res.status(409).json({
        success: false,
        error: "This Action Assign is already exist",
        on: duplicate
      });
    }

    // Done
    await commitTransactions(sessions);

    return res.status(200).json({
      success: true,
      data: newEventAssign
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