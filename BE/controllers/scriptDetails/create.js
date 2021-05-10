const ScriptDetails = require("../../models/scriptDetails")
const Scripts = require("../../models/scripts")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const notifications = require("../../models/notifications")
const scriptHistories = require("../../models/scriptHistories")
const create = async (req, res) => {
  let sessions = []
  try {
    //check permission
    const doc = await Scripts.findOne({ _id: req.body.scriptId, isDeleted: false })
      .populate({ path: 'eventId', select: 'name' })
    let permissons = await Permission.getPermission(doc.eventId._id, req.user._id, req.user.roleId._id)
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

    // start notification
    //prepare data
    let noti = {}
    noti.name = "Tạo mới"
    noti.userId = doc.forId
    noti.description = `Kịch bản ${doc.name} của sự kiện ${doc.eventId.name} đã được tạo chi tiết ${newDoc.name}`
    noti.scriptId = doc._id
    //access DB
    let created_notification = await notifications.create(
      noti
    )

    let result_notification = await notifications.findById(created_notification._id)
      .populate({path:'userId', select:'push_notification_token'})
    // done notification

    //start history
    let isCreateDetail = true
    let data_history = {
      userId: req.body.updateUserId,
      scriptId: doc._id,
      scriptDetailId: newDoc[0]._id,
      isCreateDetail,
      nameCreateDetail: newDoc[0].name
    }

    let temp_created_history = await scriptHistories.create(data_history)

    let created_history = await scriptHistories.findById(temp_created_history._id)
      .populate({ path: 'userId', select: 'name photoUrl' })
      .populate({ path: 'scriptId', populate: { path: 'forId', select: 'name' }, select: 'name forId' })
      .populate("scriptDetailId")
      .populate({ path: 'oldForIdScript', select: 'name' })
      .populate({ path: 'newForIdScript', select: 'name' })

    //done history

    // Success
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: newDoc,
      notification: result_notification,
      history: created_history
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