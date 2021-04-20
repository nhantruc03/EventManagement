const Scripts = require("../../models/scripts")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const create = async (req, res) => {
  let sessions = [];
  try {
    //check permissson
    let permissons = await Permission.getPermission(req.body.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KICHBAN_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    const query = {
      $and: [
        { name: req.body.name },
        { eventId: req.body.eventId }
      ],
      isDeleted: false
    } // for oldDocs

    // Handle data
    const { error, body } = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error,
      });
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Access DB
    const newDoc = await Scripts.create([body], { session: session });

    // Check duplicate
    const oldDocs = await Scripts.find(query, null, { session })
    if (oldDocs.length > 1) {
      await abortTransactions(sessions);
      return res.status(406).json({
        success: false,
        error: "Duplicate data",
      });
    }

    // Success
    const doc = await Scripts.findOne(
      { _id: newDoc[0]._id, isDeleted: false },
      null,
      { session }
    )
      .populate({ path: "writerId", select: "name" })
      .populate({ path: "forId", select: "name" });
    await commitTransactions(sessions);
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    await abortTransactions(sessions);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { create };
