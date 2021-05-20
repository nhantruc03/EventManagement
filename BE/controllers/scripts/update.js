const Scripts = require('../../models/scripts')
const notifications = require('../../models/notifications')
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const scriptHistories = require('../../models/scriptHistories')
const update = async (req, res) => {
  let sessions = []
  try {
    //check permissson
    let doc = await Scripts.findById(req.params.id)
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
        { eventId: req.body.eventId }
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

    const updated = await Scripts.findOneAndUpdate(
      queryUpdate,
      body,
      { session, new: true }
    )
      .populate({ path: 'eventId', select: 'name' })
      .populate({ path: 'writerId', select: 'name' })
      .populate({ path: 'forId', select: 'name' })

    // Check duplicate
    const oldDocs = await Scripts.find(queryOld, null, { session })

    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }
    //start history
    let isChangeNameScript = false
    let isChangeForIdScript = false
    if (doc.name !== updated.name) {
      isChangeNameScript = true
    }
    if (doc.forId.toString() !== updated.forId.toString()) {
      console.log("userid khác nhau")
      isChangeForIdScript = true
    }
    let data_history = {
      userId: req.body.updateUserId,
      scriptId: doc._id,
      oldNameScript: doc.name,
      oldForIdScript: doc.forId,
      newNameScript: updated.name,
      newForIdScript: updated.forId,
      isChangeNameScript,
      isChangeForIdScript
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
    noti.userId = updated.forId
    noti.description = `Kịch bản ${updated.name} của sự kiện ${updated.eventId.name} đã được cập nhật thông tin chung`
    noti.scriptId = updated._id
    //access DB
    let created_notification = await notifications.create(
      noti
    )

    let result_noti = await notifications.findById(created_notification._id)
      .populate({ path: 'userId', select: 'push_notification_token' })

    // done notification
    // Updated Successfully
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: updated,
      notification: result_noti,
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