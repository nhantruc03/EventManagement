const Guests = require('../../models/guests')

const _delete = async (req, res) => {
  try {
    const queryDelete = { _id: req.params.id, isDeleted: false }
    console.log(queryDelete)
    const deleted = await Guests.findOneAndUpdate(
        queryDelete,
        { isDeleted: true },
        { new: true }
      )
    
    // Deleted Successfully
    return res.status(200).json({
      success: true,
      data: deleted
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { _delete }