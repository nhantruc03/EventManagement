const EventAssign = require('../../models/eventAssign')
const { isEmpty, pick } = require("lodash");
const Events = require('../../models/events');
const _delete = async (req, res) => {
  try {
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