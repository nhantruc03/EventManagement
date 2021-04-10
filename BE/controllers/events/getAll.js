const { pick, isEmpty } = require('lodash')
const Events = require('../../models/events')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page
  const gt = req.query.gt
  const lt = req.query.lt
  const eq = req.query.eq

  try {
    // const query = { isDeleted: false }
    let query

    if (!isEmpty(gt)) {
      query = {
        ...pick(req.body, "isClone"),
        startDate: {
          $gt: new Date(gt)
        },
        isDeleted: false
      }
    }
    else if (!isEmpty(lt)) {
      query = {
        ...pick(req.body, "isClone"),
        startDate: {
          $lt: new Date(lt)
        },
        isDeleted: false
      }
    }
    else if (!isEmpty(eq)) {
      query = {
        ...pick(req.body, "isClone"),
        startDate: {
          $eq: new Date(eq)
        },
        isDeleted: false
      }
    }
    else {
      query = {
        ...pick(req.body, "isClone"),
        isDeleted: false
      }
    }



    let docs;
    if (!page || !limit) {
      docs = await Events.find(query)
        .populate({ path: 'tagId', select: 'name' })
        .populate({ path: 'availUser', select: 'photoUrl name' })
    }
    else {
      docs = await Events.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({ path: 'tagId', select: 'name' })
        .populate({ path: 'availUser', select: 'photoUrl name' })
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

