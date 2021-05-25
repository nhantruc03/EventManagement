const participants = require("../../models/participants")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { pick } = require("lodash")

const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")

const create = async (req, res) => {
  let sessions = []
  try {
    //check permissson
    let permissons = await Permission.getPermission(req.body.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_NGUOITHAMGIA_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    // create
    const query = {
      $and: [
        { mssv: req.body.mssv },
        { eventId: req.body.eventId }
      ],
      isDeleted: false
    } // for oldDocs

    let body = []
    req.body.data.forEach(element => {
      let temp = {
        ...pick(element,
          "eventId",
          "name",
          "mssv",
          "phone",
          "email"
        )
      }
      body.push(temp)
    });

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Create
    const newDoc = await participants.insertMany(
      body,
      { session: session }
    )

    // Check duplicate
    const oldDocs = await participants.find(query, null, { session })
    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }

    // Success
    await commitTransactions(sessions)
    // done notification

    return res.status(200).json({
      success: true,
      data: newDoc,
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