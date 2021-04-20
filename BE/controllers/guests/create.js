const Guests = require("../../models/guests")
const GuestTypes = require("../../models/guestTypes")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const create = async (req, res) => {
  let sessions = []
  try {
    //check permissson
    const temp = await GuestTypes.findOne({ _id: req.body.guestTypeId, isDeleted: false })
    let permissons = await Permission.getPermission(temp.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KHACHMOI_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
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

    // Access DB
    const newDoc = await Guests.create([body], { session: session })

    // Check duplicate
    // const oldDocs = await Guests.find(query, null, { session })
    // if (oldDocs.length > 1) {
    //   await abortTransactions(sessions)
    //   return res.status(406).json({
    //     success: false,
    //     error: "Duplicate data"
    //   })
    // }
    // Success
    await commitTransactions(sessions)
    const doc = await Guests.findOne({ _id: newDoc[0]._id, isDeleted: false })
      .populate({ path: 'guestTypeId', select: 'name status' })

    return res.status(200).json({
      success: true,
      data: doc
    });
  } catch (error) {
    await abortTransactions(sessions)
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { create }