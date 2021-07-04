const EventAssign = require('../../models/eventAssign')
const Scripts = require('../../models/scripts')
const Actions = require('../../models/actions')
const Events = require('../../models/events');
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const _delete = async (req, res) => {
  try {
    //check permissson
    const doc = await EventAssign.findById(req.params.id)
    let permissons = await Permission.getPermission(doc.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_BANTOCHUC_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }

    const list_scripts = await Scripts.find({ eventId: doc.eventId, forId: doc.userId }).select('name')
    const list_actions = await Actions.find({ eventId: doc.eventId, availUser: doc.userId }).select('name')
    if (list_scripts.length > 0 || list_actions.length > 0) {
      return res.status(406).json({
        success: false,
        error: "User is in another scripts or actions!",
        list_scripts: list_scripts,
        list_actions: list_actions
      })
    }

    const queryDelete = { _id: req.params.id, isDeleted: false }

    const deleted = await EventAssign.findOneAndUpdate(
      queryDelete,
      { isDeleted: true },
      { new: true }
    )
    //update avail user
    const event = await Events.findOne({ _id: deleted.eventId, isDeleted: false })

    let data = event.availUser.filter(e => e.toString() !== deleted.userId.toString());


    const updated = await Events.findOneAndUpdate(
      { _id: deleted.eventId, isDeleted: false },
      { availUser: data },
      { new: true }
    )

    // Deleted Successfully
    return res.status(200).json({
      success: true,
      data: deleted,
      updatedEvent: updated
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { _delete }