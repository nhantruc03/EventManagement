const ScriptDetails = require('../../models/scriptDetails')
const Scripts = require("../../models/scripts")
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const notifications = require('../../models/notifications')
const scriptHistories = require('../../models/scriptHistories')
const _delete = async (req, res) => {
  try {
    //check permission
    const scriptDetails = await ScriptDetails.findById(req.params.id)
    const doc = await Scripts.findOne({ _id: scriptDetails.scriptId, isDeleted: false })
      .populate({ path: 'eventId', select: 'name' })

    let permissons = await Permission.getPermission(doc.eventId._id, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KICHBAN_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    const queryDelete = { _id: req.params.id, isDeleted: false }

    const deleted = await ScriptDetails.findOneAndUpdate(
      queryDelete,
      { isDeleted: true },
      { new: true }
    )
    // start notification


    //prepare data
    let noti = {}
    noti.name = "Xóa"
    noti.userId = doc.forId
    noti.description = `Kịch bản ${doc.name} của sự kiện ${doc.eventId.name} đã xóa chi tiết ${deleted.name}`
    noti.scriptId = scriptDetails.scriptId

    //access DB
    let created_notification = await notifications.create(
      noti
    )

    let result_notification = await notifications.findById(created_notification._id)
      .populate({path:'userId', select:'push_notification_token'})

    // done notification

    //start history
    let isDeleteDetail = true
    let data_history = {
      userId: req.query.updateUserId,
      scriptId: scriptDetails.scriptId,
      scriptDetailId: scriptDetails._id,
      isDeleteDetail,
      nameDeleteDetail: scriptDetails.name
    }

    let temp_created_history = await scriptHistories.create(data_history)
    let created_history = await scriptHistories.findById(temp_created_history._id)
      .populate({ path: 'userId', select: 'name photoUrl' })
      .populate({ path: 'scriptId', populate: { path: 'forId', select: 'name' }, select: 'name forId' })
      .populate("scriptDetailId")
      .populate({ path: 'oldForIdScript', select: 'name' })
      .populate({ path: 'newForIdScript', select: 'name' })

    //done history
    // Deleted Successfully
    return res.status(200).json({
      success: true,
      data: deleted,
      notification: result_notification,
      history: created_history
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { _delete }