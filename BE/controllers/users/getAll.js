const { pick, isEmpty } = require('lodash');
const Users = require('../../models/users');
const Roles = require('../../models/roles');
const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    let query = {
      isDeleted: false
    };

    if (!isEmpty(req.body.role)) {
      let role_query = {
        name: req.body.role,
        isDeleted: false
      }
      role = await Roles.findOne(role_query)
      query.roleId = role._id
    }


    let docs;
    if (!page || !limit) {
      docs = await Users.find(query)
        .populate({ path: 'roleId', select: 'name' })
    }
    else {
      docs = await Users.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({ path: 'roleId', select: 'name' })
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