const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../../models/users");
const Credentials = require('../../models/credentials')
const login = async (req, res) => {
  try {
    // Check username is exist
    const user = await Users
      .findOne({ username: req.body.username, isDeleted: false }).select("password _id name roleId")
      .populate({ path: 'roleId', select: 'name' });

    // const role = await Credentials
    //   .findOne({ userId: user._id, isDeleted: false })
    //   .populate({ path: 'roleId', select: 'name' })
    if (user == null) {
      return res.json({ success: false, error: "Login failed" });
    }

    // Compare password of user above
    const isLogin = await bcrypt.compareSync(req.body.password, user.password);
    if (!isLogin) {
      return res.json({ success: false, error: "Login failed" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "14d" }
    );

    var data = {
      token: token,
      name: user.name,
      id: user._id,
      role: user.roleId.name
    }

    return res.status(200).json({ success: isLogin, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { login }