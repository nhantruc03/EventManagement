const Guests = require('../../models/guests')
const GuestTypes = require("../../models/guestTypes")
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const update = async (req, res) => {
  let sessions = []
  try {
    //check permissson
    const temp_guest = await Guests.findById(req.params.id)
    const temp = await GuestTypes.findOne({ _id: temp_guest.guestTypeId, isDeleted: false })
    console.log(temp)
    let permissons = await Permission.getPermission(temp.eventId, req.user._id, req.user.roleId._id)
    if (!Permission.checkPermission(permissons, constants.QL_KHACHMOI_PERMISSION)) {
      return res.status(406).json({
        success: false,
        error: "Permission denied!"
      })
    }
    const query = {
      $or: [
        {
          $and: [
            { email: req.body.email },
            { guestTypeId: req.body.guestTypeId }
          ]
        },
        {
          $and: [

            { phone: req.body.phone },
            { guestTypeId: req.body.guestTypeId }
          ]
        }
      ]
      ,
      isDeleted: false
    } // for oldDocs
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

    const updated = await Guests.findOneAndUpdate(
      queryUpdate,
      body,
      { session, new: true }
    )

    // Check duplicate
    const oldDocs = await Guests.find(query, null, { session })

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