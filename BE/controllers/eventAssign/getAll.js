const { pick } = require('lodash')
const EventAssign = require('../../models/eventAssign')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    const query = { ...pick(req.body, 'eventId'), isDeleted: false }
    
    let docs;
    if (!page || !limit) {
      docs = await EventAssign.find(query)
        .populate("userId")
        .populate("eventId")
        .populate({ path: 'roleId', select: 'name' })
        .populate({ path: 'userId', select: 'name phone email' })
        .populate({ path: 'facultyId', select: 'name' })
    }
    else {
      docs = await EventAssign.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate("userId")
        .populate("eventId")
        .populate({ path: 'roleId', select: 'name' })
        .populate({ path: 'userId', select: 'name phone email' })
        .populate({ path: 'facultyId', select: 'name' })
    }
    return res.status(200).json({
      success: true,
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { getAll }