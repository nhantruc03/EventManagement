const eventReports = require("../../models/eventReports")
const events = require("../../models/events")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const guests = require("../../models/guests")
const GuestTypes = require("../../models/guestTypes")
const actions = require("../../models/actions")
const participants = require("../../models/participants")
const actionResources = require("../../models/actionResources")
const { pick } = require("lodash")
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const create = async (req, res) => {
  let sessions = []
  try {
    //check permissson
    let permissons = await Permission.getPermission(req.body.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_SUKIEN_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }

    const query = {
      eventId: req.body.eventId,
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

    let event = await events.findById(req.body.eventId)

    let eventAssignNum = 0;
    if (event.availUser) {
      eventAssignNum = event.availUser.length
    }

    let listguesttypes = await GuestTypes.find({
      ...pick(req.body, "eventId"),
      isDeleted: false
    })

    let listguests = await guests.find({
      guestTypeId: listguesttypes,
      isDeleted: false
    })



    let guestsNum = 0
    if (listguests) {
      guestsNum = listguests.length
    }


    let listparticipants = await participants.find({
      ...pick(req.body, "eventId"),
      isDeleted: false
    })

    let participantsNum = 0;
    if (listparticipants) {
      participantsNum = listparticipants.length
    }



    let listAction = await actions.find({ ...pick(req.body, "eventId"), isDeleted: false })

    let actionsNum = 0
    let completeActionNum = 0
    let uncompleteActionNum = 0
    if (listAction) {
      actionsNum = listAction.length
      completeActionNum = listAction.filter(e => e.status === true).length
      uncompleteActionNum = listAction.filter(e => e.status === false).length

    }

    let listResources = [];
    // for (const e of clone_Scripts) {
    await Promise.all(listAction.map(async (e) => {

      let curResources = await actionResources.find({ actionId: e._id, isDeleted: false })
      listResources = [...listResources, ...curResources]
    }))

    let newdata = {
      eventId: req.body.eventId,
      eventAssigns: eventAssignNum ? eventAssignNum : 0,
      guests: guestsNum ? guestsNum : 0,
      participants: participantsNum ? participantsNum : 0,
      actions: actionsNum ? actionsNum : 0,
      completeAction: completeActionNum ? completeActionNum : 0,
      uncompleteAction: uncompleteActionNum ? uncompleteActionNum : 0,
      resources: listResources
    }

    // Check duplicate
    let rest = {}
    const oldDocs = await eventReports.find(query, null, { session })
    if (oldDocs.length > 0) {
      let oldReport = oldDocs[0]
      const queryUpdate = { _id: oldReport._id, isDeleted: false }
      const updated = await eventReports.findOneAndUpdate(
        queryUpdate,
        newdata,
        { session, new: true }
      )
      rest = updated
    } else {
      const newDoc = await eventReports.create([newdata], { session: session })
      rest = newDoc[0]
    }

    let final = await eventReports.findById(rest._id, null, { session })
      .populate({ path: 'eventId', select: 'name' })
      .populate({ path: 'resources', populate: { path: "userId", select: 'name' } })

    // Success
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: final
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