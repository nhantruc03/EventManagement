const Scripts = require("../../models/scripts")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
let event = require("../../models/events")
const notifications = require("../../models/notifications")
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

    // start notification
    const cur_event = await event.findById(req.body.eventId);
    //prepare data
    let noti = {}
    noti.name = "Tạo mới"
    noti.userId = doc.forId._id
    noti.description = `Sự kiện ${cur_event.name} đã được tạo kịch bản ${doc.name}`
    noti.scriptId = doc._id
    //access DB
    let created_notification = await notifications.create(
      noti
    )
    let result_noti = await notifications.findById(created_notification._id)
      .populate({path:'userId',select:'push_notification_token'})
    // done notification
    
    await commitTransactions(sessions);
    return res.status(200).json({
      success: true,
      data: doc,
      notification: result_noti
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
