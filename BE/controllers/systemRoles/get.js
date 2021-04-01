const systemRoles = require('../../models/systemRoles')

const get = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false }

    const doc = await systemRoles.findOne(query)

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