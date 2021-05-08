const ScriptDetails = require('../../models/scriptDetails')
const Scripts = require("../../models/scripts")
const notifications = require('../../models/notifications')
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const scriptHistories = require('../../models/scriptHistories')
const moment = require("moment")
const update = async (req, res) => {
  let sessions = []
  try {
    //check permission
    const temp_scriptdetails = await ScriptDetails.findById(req.params.id)
    const doc = await Scripts.findOne({ _id: temp_scriptdetails.scriptId, isDeleted: false })
      .populate({ path: 'eventId', select: 'name' })
    let permissons = await Permission.getPermission(doc.eventId._id, req.user._id, req.user.roleId._id)
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
    const beforeUpdate = await ScriptDetails.findOne(queryUpdate)

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


    //start history
    let isChangeNameScriptDetail = false
    let isChangeDescriptionScriptDetail = false
    let isChangeTimeScriptDetail = false
    if (beforeUpdate.name !== updated.name) {
      isChangeNameScriptDetail = true
    }
    if (moment(beforeUpdate.time).utcOffset(0).format("HH:mm") !== moment(updated.time).utcOffset(0).format("HH:mm")) {
      isChangeTimeScriptDetail = true
    }
    if (beforeUpdate.description !== updated.description) {
      isChangeDescriptionScriptDetail = true
    }
    let data_history = {
      userId: req.body.updateUserId,
      scriptId: beforeUpdate.scriptId,
      scriptDetailId: beforeUpdate._id,
      oldNameScriptDetail: beforeUpdate.name,
      oldDescriptionScriptDetail: beforeUpdate.description,
      oldTimeScriptDetail: beforeUpdate.time,
      newNameScriptDetail: updated.name,
      newDescriptionScriptDetail: updated.description,
      newTimeScriptDetail: updated.time,
      isChangeNameScriptDetail,
      isChangeDescriptionScriptDetail,
      isChangeTimeScriptDetail,
      updateScriptDetailName: beforeUpdate.name
    }

    let temp_created_history = await scriptHistories.create(data_history)
    let created_history = await scriptHistories.findById(temp_created_history._id)
      .populate({ path: 'userId', select: 'name photoUrl' })
      .populate({ path: 'scriptId', populate: { path: 'forId', select: 'name' }, select: 'name forId' })
      .populate("scriptDetailId")
      .populate({ path: 'oldForIdScript', select: 'name' })
      .populate({ path: 'newForIdScript', select: 'name' })

    //done history

    // start notification
    //prepare data
    let noti = {}
    noti.name = "Cập nhật"
    noti.userId = doc.forId
    noti.description = `Kịch bản ${doc.name} của sự kiện ${doc.eventId.name} đã được cập nhật chi tiết ${updated.name}`
    noti.scriptId = doc._id
    //access DB
    let created_notification = await notifications.create(
      noti
    )

    // done notification

    // Updated Successfully
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: updated,
      notification: created_notification,
      history: created_history
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