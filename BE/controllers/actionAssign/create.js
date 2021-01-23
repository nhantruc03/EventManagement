const ActionAssign = require("../../models/actionAssign")
const EventAssign = require("../../models/eventAssign")
const Actions = require("../../models/actions")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { isArray, pick, isEmpty } = require("lodash")

const create = async (req, res) => {
  let sessions = []
  try {
    if (isArray(req.body) !== true) {
      return res.status(406).json({
        success: false,
        error: "You must be pass an array"
      });
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Prepare data for Create
    let data = req.body.map(element =>
      pick(element,
        "actionId",
        "userId",
        "role"
      )
    )
    // const query = {
    //   isDeleted: false
    // } // for oldDocs
    // // check user user exist in event before assign to action
    // let fail1 = false;
    // let fail2 = false;
    // let usernotExist;

    // for (const e of data) {
    //   let temp_action = await Actions.findById(e.actionId);
    //   let temp_user_event = await EventAssign.find({
    //     isDeleted: false,
    //     userId: e.userId,
    //     eventId: temp_action.eventId
    //   })

    //   if (isEmpty(temp_action.dependActionId)) {
    //     if (temp_user_event.length < 1) {
    //       fail1 = true;
    //       usernotExist = e.userId;
    //     }
    //   } else {
    //     let temp_user_action = await ActionAssign.find({ isDeleted: false, userId: e.userId, dependActionId: temp_action.dependActionId });
    //     if (temp_user_event.length < 1 || temp_user_action.length < 1) {
    //       fail2 = true;
    //       usernotExist = e.userId;
    //     }
    //   }
    // }

    // if (fail1 || fail2) {
    //   return res.status(409).json({
    //     success: false,
    //     error: "User are not exist in this event or this depend action!",
    //     on: usernotExist
    //   });
    // }

    // Create
    const newActionAssign = await ActionAssign.insertMany(
      data,
      { session: session }
    )

    if (isEmpty(newActionAssign) || newActionAssign.length != data.length) {
      await abortTransactions(sessions);
      return res.status(406).json({
        success: false,
        error: "Created failed"
      });
    }

    // Check exist
    let findActionAssignMethods = []
    data.forEach(element => {
      findActionAssignMethods.push(
        ActionAssign.find({
          actionId: element.actionId,
          userId: element.userId,
          isDeleted: false
        }, null, { session })
      )
    })
    let oldActionAssign = await Promise.all(findActionAssignMethods)

    let checkExist = false;
    let duplicate = [];
    oldActionAssign.forEach(e => {
      if (e.length > 1) {
        duplicate = e;
        checkExist = true
      }
    })
    if (checkExist) {
      await abortTransactions(sessions);
      return res.status(409).json({
        success: false,
        error: "This Action Assign is already exist",
        on: duplicate
      });
    }

    //check not in event

    let eventId = await Actions.findById(data[0].actionId);

    let findInEventMethods = []
    data.forEach(element => {
      findInEventMethods.push(
        EventAssign.find({
          eventId: eventId,
          userId: element.userId,
          isDeleted: false
        }, null, { session })
      )
    })
    let oldEventAssign = await Promise.all(findInEventMethods)

    let checkExist2 = true;
    let duplicate2 = [];
    oldEventAssign.forEach(e => {
      if (e.length < 1) {
        duplicate2 = e;
        checkExist2 = false
      }
    })
    if (checkExist2 === false) {
      await abortTransactions(sessions);
      return res.status(409).json({
        success: false,
        error: "User not exist in event"
      });
    }

    // Done
    await commitTransactions(sessions);

    return res.status(200).json({
      success: true,
      data: newActionAssign
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