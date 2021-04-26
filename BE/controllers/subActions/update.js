const subActions = require('../../models/subActions')
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { pick } = require('lodash')
const update = async (req, res) => {
  let sessions = []
  try {
    const queryOld = {
      $and: [
        { name: req.body.name },
        { actionId: req.body.actionId }
      ],
      isDeleted: false
    }
    const queryUpdate = { _id: req.params.id, isDeleted: false }

    // Handle data
    // const { error, body } = handleBody(req.body) // for newDoc
    // if (error) {
    //   return res.status(406).json({
    //     success: false,
    //     error: error
    //   })
    // }
    let body = {
      ...pick(req.body,
        "actionId",
        "name",
        "endDate",
        "endTime",
        "description",
        "status"
      )
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    const updated = await subActions.findOneAndUpdate(
      queryUpdate,
      body,
      { session, new: true }
    )

    // Check duplicate
    const oldDocs = await subActions.find(queryOld, null, { session })

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