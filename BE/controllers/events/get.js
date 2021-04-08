const Events = require('../../models/events')

const get = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false }

    const doc = await Events.findOne(query)
      .populate({ path: 'tagId', select: 'name' })
      .populate({ path: 'availUser', select: 'photoUrl name phone email mssv' })
      .populate({ path: 'eventTypeId', select: 'name' })

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