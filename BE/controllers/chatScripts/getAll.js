const { pick } = require('lodash')
const chatScripts = require('../../models/chatScripts')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    const query = {
      ...pick(req.body, "actionId"),
      isDeleted: false
    }

    let docs;
    if (!page || !limit) {
      docs = await chatScripts.find(query)
        .populate({ path: 'userId', select: 'name photoUrl' })
    }
    else {
      docs = await chatScripts.find(query)
        .sort({ 'createdAt': -1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({ path: 'userId', select: 'name photoUrl' })
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