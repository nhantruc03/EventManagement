const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  jwt.verify(
    req.headers.authorization,
    process.env.ACCESS_TOKEN_KEY,
    async function (err, decoded) {
      if (err) {
        return res.json({ success: false, error: err.message });
      }
      const user = await mongoose
        .model("users")
        .findOne({ _id: decoded.userId, isDeleted: false })
        .populate({ path: 'roleId', select: 'name' })
      // const role = await mongoose
      //   .model("credentials")
      //   .findOne({ userId: user._id, isDeleted: false })
      //   .populate({ path: 'roleId', select: 'name' })
      if (user) {
        req.user = user;
        req.role = user.roleId.name;
      } else {
        return res.json({ success: false, error: "User not found" });
      }
      next();
    }
  );
};

module.exports = { authenticateToken };
