const { pick } = require('lodash')
const Scripts = require('../../models/scripts')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    const query = { ...pick(req.body, "eventId"), isDeleted: false }

    let docs;
    if (!page || !limit) {
      docs = await Scripts.find(query)
      .populate({path:'writerId',select:'name'})
      .populate({path:'forId',select:'name'})
    }
    else {
      docs = await Scripts.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({path:'writerId',select:'name'})
        .populate({path:'forId',select:'name'})
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