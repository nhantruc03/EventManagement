const { pick, isEmpty } = require('lodash')
const Actions = require('../../models/actions')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {

    // let currentUser = { ...pick(req.body, "currentUser") }
    let query = { ...pick(req.body, "eventId", "availUser"), isDeleted: false }

    let docs;
    if (!page || !limit) {
      docs = await Actions.find(query)
        .populate({ path: 'availUser', select: 'name photoUrl' })
        .populate({ path: 'tagsId', select: 'name background color' })
        .populate({ path: 'facultyId', select: 'name' })
        .populate({ path: 'priorityId', select: 'name' })
        .populate({ path: 'eventId', select: 'name' })
        .populate({ path: 'actionTypeId', select: 'name' })
        .populate("dependActionId")
    }
    else {
      docs = await Actions.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({ path: 'availUser', select: 'name photoUrl' })
        .populate({ path: 'tagsId', select: 'name background color' })
        .populate({ path: 'facultyId', select: 'name' })
        .populate({ path: 'priorityId', select: 'name' })
        .populate({ path: 'eventId', select: 'name' })
        .populate({ path: 'actionTypeId', select: 'name' })
        .populate("dependActionId")
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