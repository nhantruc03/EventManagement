const ScriptDetails = require("../../models/scriptDetails")
const Scripts = require("../../models/scripts")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const create = async (req, res) => {
  let sessions = []
  try {
    //check permission
    const doc = await Scripts.findOne({ _id: req.body.scriptId, isDeleted: false })
    let permissons = await Permission.getPermission(doc.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KICHBAN_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    const query = {
      $and: [
        { name: req.body.name },
        { scriptId: req.body.scriptId }
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


    // Access DB
    const newDoc = await ScriptDetails.create([body], { session: session })

    // Check duplicate
    const oldDocs = await ScriptDetails.find(query, null, { session })
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
    await abortTransactions(sessions)
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { create }