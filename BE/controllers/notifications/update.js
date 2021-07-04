const { pick, isElement, isEmpty } = require('lodash')
const notifications = require('../../models/notifications')
const update = async (req, res) => {
  try {
    const filter = {
      ...pick(req.body, 'userId', "_id"),
      isDeleted: false
    }

    const body = {
      ...pick(req.body, 'watch', 'status')
    }

    let updated
    if (isEmpty(filter._id)) {
      updated = await notifications.updateMany(
        filter,
        body,
        { new: true }
      )
    }
    else {
      updated = await notifications.findOneAndUpdate(
        filter,
        body,
        { new: true }
      )
    }

    // Updated Successfully
    return res.status(200).json({
      success: true,
      data: updated
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { update }