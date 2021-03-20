const notifications = require('../../models/notifications')
const { handleBody } = require('./handleBody')
const update = async (req, res) => {
  try {
    const queryUpdate = { _id: req.params.id, isDeleted: false }

    // Handle data
    const { error, body } = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error
      })
    }

    const updated = await notifications.findOneAndUpdate(
      queryUpdate,
      body,
      { new: true }
    )

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