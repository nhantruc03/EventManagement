const Users = require('../../models/users')
const { isAdmin } = require("../../services/checkAdmin")

const get = async (req, res) => {
  try {
    // // Check owner:  not admin && not owner => out
    // if ( req.user.role !== "admin" && req.user._id !== req.params.id ) {
    //   return res.status(406).json({
    //     success: false,
    //     error: "Can not access others user information"
    //   })
    // }

    const query = { _id: req.params.id, isDeleted: false }

    const doc = await Users.findOne(query)
      // .populate("departmentId")

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