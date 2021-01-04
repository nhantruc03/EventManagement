const Users = require('../../models/users')

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    const query = { isDeleted: false }

    let docs;
    if (!page || !limit) {
      docs = await Users.find(query)
        .populate("departmentId", "name")
        .populate("facultyId", "name")
    }
    else {
      docs = await Users.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate("departmentId", "name")
        .populate("facultyId", "name")
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