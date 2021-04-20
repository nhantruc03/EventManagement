const ScriptDetails = require('../../models/scriptDetails')
const Scripts = require("../../models/scripts")
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const _delete = async (req, res) => {
  try {
    //check permission
    const scriptDetails = await ScriptDetails.findById(req.params.id)
    const doc = await Scripts.findOne({ _id: scriptDetails.scriptId, isDeleted: false })
    console.log(doc)
    let permissons = await Permission.getPermission(doc.eventId, req.user._id, req.user.roleId._id)
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