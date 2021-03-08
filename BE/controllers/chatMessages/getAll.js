const { pick } = require('lodash')
const ChatMessages = require('../../models/chatMessages')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    const query = {
      ...pick(req.body, "groupID"),
      isDeleted: false
    }

    let docs;
    if (!page || !limit) {
      docs = await ChatMessages.find(query)
        .populate({ path: 'userID', select: 'photoURL' })
    }
    else {
      docs = await ChatMessages.find(query)
        .sort({ 'createdAt': -1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({ path: 'userID', select: 'photoURL' })
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