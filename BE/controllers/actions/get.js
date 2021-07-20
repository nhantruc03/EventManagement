const Actions = require('../../models/actions')

const get = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false }

    const doc = await Actions.findOne(query)
      .populate({ path: 'availUser', select: 'name photoUrl' })
      .populate({ path: 'managerId', select: 'name photoUrl' })
      .populate({ path: 'tagsId', select: 'name background color' })
      .populate({ path: 'facultyId', select: 'name' })
      .populate({ path: 'priorityId', select: 'name' })
      .populate({ path: 'eventId', select: 'name expireDate beginDate' })
      .populate({ path: 'actionTypeId', select: 'name' })
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