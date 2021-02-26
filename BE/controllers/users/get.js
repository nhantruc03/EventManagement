const Users = require('../../models/users')
// const Credentials = require('../../models/credentials')
// const roles = require('../../models/roles')
// var mongoose = require('mongoose');
// var Vehicle = require('../../models/vehicals')
// var Audi = require('../../models/audi');
// var Audi = mongoose.model('Audi');
const get = async (req, res) => {
  // demo inherit
  // const newDoc2 = await Audi.create({
  //   a: 'a',
  //   b: 'b',
  //   c: 'c',
  //   d: 'd',
  //   f: 'f',
  // })
  // console.log(newDoc2)

  // const list = await Vehicle.find();
  // list.forEach(e=>{
  //   console.log(e.type)
  // })
  // console.log(list);

  // return res.status(200).json({
  //   success: true,
  //   data: list
  // })
  try {
    // Check owner:  not admin && not owner => out
    const user = await Users
      .findOne({ _id: req.user._id, isDeleted: false })
      .populate({ path: 'roleId', select: 'name' })
    // const role = await Credentials
    //   .findOne({ userId: req.user._id, isDeleted: false })
    //   .populate({ path: 'roleId', select: 'name' })

    if (user.roleId.name !== "Admin" && req.user._id !== req.params.id) {
      return res.status(406).json({
        success: false,
        error: "Can not access others user information"
      })
    }

    const query = { _id: req.params.id, isDeleted: false }

    const doc = await Users.findOne(query)

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