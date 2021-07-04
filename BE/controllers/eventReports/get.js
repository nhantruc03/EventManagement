const eventReports = require('../../models/eventReports')

const get = async (req, res) => {
  try {
    const query = { eventId: req.params.id, isDeleted: false }

    const doc = await eventReports.find(query)
      .populate({ path: 'eventId', select:'name'})
      .populate({ path: 'resources', populate: { path: "userId", select: 'name' }})

    return res.status(200).json({
      success: true,
      data: doc[0]
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { get }