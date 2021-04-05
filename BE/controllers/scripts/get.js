const Scripts = require('../../models/scripts')

const get = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false }

    const doc = await Scripts.findOne(query)
      .populate({ path: 'eventId', select: 'startDate startTime' })
      .populate({ path: 'writerId', select: 'name' })
      .populate({ path: 'forId', select: 'name' })

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