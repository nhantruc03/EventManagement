const Users = require('../../models/users')
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const bcrypt = require("bcryptjs")
const Credentials = require("../../models/credentials")
const update = async (req, res) => {
  let sessions = []
  try {
    // Check owner:  not admin && not owner => out
    const user = await Users
      .findOne({ _id: req.user._id, isDeleted: false })
      .populate({ path: 'roleId', select: 'name' })
      
    if (user.roleId.name !== "Admin" && req.user._id !== req.params.id) {
      return res.status(406).json({
        success: false,
        error: "Can not access others user information"
      })
    }

    //query
    const queryOld = {
      $or: [
        { phone: req.body.phone },
        { email: req.body.email },
        { username: req.body.username },
        { mssv: req.body.mssv }
      ],
      isDeleted: false
    }
    const queryUpdate = { _id: req.params.id, isDeleted: false }

    // Handle data
    const { error, body } = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error
      })
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Hash password
    if (body.password != null) {
      body.password = await bcrypt.hashSync(body.password, 10);
    }

    const updated = await Users.findOneAndUpdate(
      queryUpdate,
      body,
      { session, new: true }
    )

    // Check duplicate
    const oldDocs = await Users.find(queryOld, null, { session })

    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }

    // Updated Successfully
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: updated
    })
  } catch (error) {
    await abortTransactions(sessions)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { update }