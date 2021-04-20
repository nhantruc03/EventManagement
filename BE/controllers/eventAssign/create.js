const EventAssign = require("../../models/eventAssign")
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const notifications = require("../../models/notifications")
const Events = require('../../models/events');
const { pick } = require("lodash")

const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")

const create = async (req, res) => {
  let sessions = []
  try {
    //check permissson
    let permissons = await Permission.getPermission(req.body.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_BANTOCHUC_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    // create
    const query = {
      $and: [
        { userId: req.body.userId },
        { eventId: req.body.eventId }
      ],
      isDeleted: false
    } // for oldDocs

    let body = []
    req.body.forEach(element => {
      let temp = {
        ...pick(element,
          "userId",
          "eventId",
          "roleId",
          "facultyId"
        )
      }
      body.push(temp)
    });

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Create
    const newDoc = await EventAssign.insertMany(
      body,
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
    // update Avail User
    const event = await Events.findOne({ _id: newDoc[0].eventId, isDeleted: false })
    let data = [...event.availUser]
    newDoc.forEach(e => {
      data.push(e.userId.toString())
    });




    const updated = await Events.findOneAndUpdate(
      { _id: newDoc[0].eventId, isDeleted: false },
      { availUser: data },
      { new: true }
    )

    // start notification
    //prepare data
    let temp_ListId = []
    let list_noti = []
    newDoc.forEach(e => {
      let body_notification = {}
      body_notification.name = "Phân công"
      body_notification.userId = e.userId
      body_notification.description = `Bạn được phân công vào sự kiện ${event.name}`
      body_notification.eventId = e._id
      list_noti.push(body_notification)
      temp_ListId.push(e._id)
    })
    const doc = await EventAssign.find({ _id: { $in: temp_ListId }, isDeleted: false }, null, { session })
      .populate("userId")
      .populate("eventId")
      .populate({ path: 'roleId', select: 'name' })
      .populate({ path: 'userId', select: 'name phone email mssv' })
      .populate({ path: 'facultyId', select: 'name' })
    //access DB
    let created_notification = await notifications.insertMany(
      list_noti
    )
    // Success
    await commitTransactions(sessions)







    // done notification

    return res.status(200).json({
      success: true,
      data: doc,
      updated: updated,
      notification: created_notification
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