const Scripts = require('../../models/scripts')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const notifications = require('../../models/notifications')
const _delete = async (req, res) => {
  try {
    //check permissson
    const doc = await Scripts.findById(req.params.id)
      .populate({ path: 'eventId', select: 'name' })
    let permissons = await Permission.getPermission(doc.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KICHBAN_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    const queryDelete = { _id: req.params.id, isDeleted: false }

    const deleted = await Scripts.findOneAndUpdate(
      queryDelete,
      { isDeleted: true },
      { new: true }
    )
    console.log(req.query.clone)
    if (!req.query.clone) {
      // start notification
      //prepare data
      let noti = {}
      noti.name = "Xóa"
      noti.userId = doc.forId
      noti.description = `Sự kiện ${doc.eventId.name} đã xóa kịch bản ${doc.name}`
      noti.eventId = doc.eventId._id
      //access DB
      let created_notification = await notifications.create(
        noti
      )
      // done notification

      // Deleted Successfully
      return res.status(200).json({
        success: true,
        data: deleted,
        notification: created_notification
      })
    }else{
      return res.status(200).json({
        success: true,
        data: deleted,
      })
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { _delete }