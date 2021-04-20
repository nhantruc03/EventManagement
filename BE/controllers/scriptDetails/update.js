const ScriptDetails = require('../../models/scriptDetails')
const Scripts = require("../../models/scripts")
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const update = async (req, res) => {
  let sessions = []
  try {
    //check permission
    const temp_scriptdetails = await ScriptDetails.findById(req.params.id)
    const doc = await Scripts.findOne({ _id: temp_scriptdetails.scriptId, isDeleted: false })
    let permissons = await Permission.getPermission(doc.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KICHBAN_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }

    const queryOld = {
      $and: [
        { name: req.body.name },
        { scriptId: req.body.scriptId }
      ],
      isDeleted: false
    }
    const queryUpdate = { _id: req.params.id, isDeleted: false }

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

    const updated = await ScriptDetails.findOneAndUpdate(
      queryUpdate,
      body,
      { session, new: true }
    )
    // Check duplicate
    const oldDocs = await ScriptDetails.find(queryOld, null, { session })

    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }

    // Updated Successfully
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: updated
    })
  } catch (error) {
    await abortTransactions(sessions)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { update }