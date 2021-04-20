const Guests = require('../../models/guests')
const GuestTypes = require("../../models/guestTypes")
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const _delete = async (req, res) => {
  try {
    //check permissson
    const guest = await Guests.findById(req.params.id)
    const temp = await GuestTypes.findOne({ _id: guest.guestTypeId, isDeleted: false })
    console.log(temp)
    let permissons = await Permission.getPermission(temp.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KHACHMOI_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    const queryDelete = { _id: req.params.id, isDeleted: false }
    const deleted = await Guests.findOneAndUpdate(
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