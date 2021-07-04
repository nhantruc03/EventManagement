const participants = require('../../models/participants')
const GuestTypes = require("../../models/guestTypes")
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const _delete = async (req, res) => {
  try {
    //check permissson
    const participant = await participants.findById(req.params.id)
    
    let permissons = await Permission.getPermission(participant.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_NGUOITHAMGIA_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    const queryDelete = { _id: req.params.id, isDeleted: false }
    const deleted = await participants.findOneAndUpdate(
      queryDelete,
      { isDeleted: true },
      { new: true }
    )

    // Deleted Successfully
    return res.status(200).json({
      success: true,
      data: deleted
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { _delete }