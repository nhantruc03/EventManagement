const { pick } = require('lodash')
const Guests = require('../../models/guests')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    var temp = pick(req.body, "listguesttype")
    const query = {
      guestTypeId: { "$in": temp.listguesttype },
      isDeleted: false
    }

    let docs;
    if (!page || !limit) {
      docs = await Guests.find(query)
        .populate({ path: 'guestTypeId', select: 'name status' })
    }
    else {
      docs = await Guests.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({ path: 'guestTypeId', select: 'name status' })
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