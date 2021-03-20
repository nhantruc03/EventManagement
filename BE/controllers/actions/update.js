const Actions = require('../../models/actions')
const ActionAssign = require('../../models/actionAssign')
const notifications = require('../../models/notifications')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { pick, isEmpty } = require('lodash')
const update = async (req, res) => {
  let sessions = []
  try {
    const queryOld = {
      $and: [
        { name: req.body.name },
        { eventId: req.body.eventId }
      ],
      isDeleted: false
    }
    const queryUpdate = { _id: req.params.id, isDeleted: false }

    // Handle data
    let body = {
      ...pick(req.body,
        "name",
        "startDate",
        "endDate",
        "description",
        "priorityId",
        "tagsId",
        "facultyId",
        "coverUrl",
        "availUser",
        "actionTypeId",
        "managerId_change",
        "availUser_change")
    }

    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    const updated = await Actions.findOneAndUpdate(
      queryUpdate,
      body,
      { session, new: true }
    )

    // Check duplicate
    const oldDocs = await Actions.find(queryOld, null, { session })

    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }
    // done action
    let body_ref = {
      ...pick(req.body,
        "managerId"
      )
    }
    // delete old Action Assign 
    if (body.availUser_change === true) {
      // await ActionAssign.deleteMany({ actionId: updated._id, role: 2 }, { session })
      await ActionAssign.updateMany({ actionId: updated._id, role: 2, isDeleted: false }, { isDeleted: true }, { session })
    }

    if (body.managerId_change === true) {
      // await ActionAssign.deleteMany({ actionId: updated._id, role: 1 }, { session })
      await ActionAssign.updateMany({ actionId: updated._id, role: 1, isDeleted: false }, { isDeleted: true }, { session })
    }

    // start Action Assign
    let listActionAssign = [];
    if (!isEmpty(updated.availUser)) {
      //prepare data
      let need_create = [];
      if (body.availUser_change === true) {
        updated.availUser.map(element => {
          let temp = {
            userId: element,
            actionId: updated._id
          }
          need_create.push(temp)
        })
      }

      if (body.managerId_change === true) {
        let temp_Manager = {
          userId: body_ref.managerId,
          role: 1,
          actionId: updated._id
        };
        need_create.push(temp_Manager)
      }
      //access DB
      if (need_create.length > 0) {
        listActionAssign = await ActionAssign.insertMany(
          need_create,
          { session: session }
        )

        if (isEmpty(listActionAssign) || listActionAssign.length != need_create.length) {
          await abortTransactions(sessions);
          return res.status(406).json({
            success: false,
            error: "Created failed"
          });
        }
        // Check duplicate Action Assign
        let findOldActionAssign = []
        updated.availUser.forEach(element => {
          findOldActionAssign.push(
            ActionAssign.find({
              $and: [
                { userId: element },
                { actionId: updated._id },
              ],
              isDeleted: false
            }, null, { session })
          )
        })
        let OldActionAssign = await Promise.all(findOldActionAssign)

        let checkExist_forActionAssign = false;
        OldActionAssign.forEach(e => {
          if (e.length > 1) {
            checkExist_forActionAssign = true
          }
        })
        if (checkExist_forActionAssign) {
          await abortTransactions(sessions);
          return res.status(409).json({
            success: false,
            error: "Action Assign is already exist"
          });
        }
      }
    }
    // done Action Assign


    // start notification
    let listNotifications = [];
    if (!isEmpty(listActionAssign)) {
      //prepare data
      let listNoti = [];

      if (body.availUser_change === true) {
        updated.availUser.map(element => {
          let temp = {}
          temp.name = "Phân công"
          temp.userId = element
          temp.description = `Bạn được phân công vào công việc ${updated.name}`
          temp.actionId = updated._id
          listNoti.push(temp)
        })
      }

      if (body.managerId_change === true) {
        let temp = {}
        temp.name = "Phân công"
        temp.userId = body_ref.managerId
        temp.description = `Bạn được phân công vào công việc ${updated.name}`
        temp.actionId = updated._id
        listNoti.push(temp)
      }


      //access DB
      listNotifications = await notifications.insertMany(
        listNoti,
        { session: session }
      )

      if (isEmpty(listNotifications) || listNotifications.length != listNoti.length) {
        await abortTransactions(sessions);
        return res.status(406).json({
          success: false,
          error: "Created failed"
        });
      }

    }
    // done notification

    // // Updated Successfully
    await commitTransactions(sessions)
    let new_data = await Actions.findOne({ _id: updated._id, isDeleted: false })
      .populate({ path: 'availUser', select: 'name photoUrl' })
      .populate({ path: 'tagsId', select: 'name' })
      .populate({ path: 'facultyId', select: 'name' })
      .populate({ path: 'priorityId', select: 'name' })
      .populate({ path: 'eventId', select: 'name' })
      .populate({ path: 'actionTypeId', select: 'name' })

    let new_actionAssign = await ActionAssign.find({ actionId: updated._id, isDeleted: false })
      .populate("actionId")
      .populate("userId")

    return res.status(200).json({
      success: true,
      data: new_data,
      actionAssign: new_actionAssign,
      notifications: listNotifications
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