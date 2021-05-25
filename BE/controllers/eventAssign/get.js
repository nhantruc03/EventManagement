const EventAssign = require('../../models/eventAssign')

const get = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false }

    const doc = await EventAssign.findOne(query)
      .populate({ path: 'eventId', select: 'name' })
      .populate({ path: 'roleId', select: 'name' })
      .populate({ path: 'userId', select: 'name phone email mssv photoUrl' })
      .populate({ path: 'facultyId', select: 'name' })

    return res.status(200).json({
      success: true,
      data: doc
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { get }