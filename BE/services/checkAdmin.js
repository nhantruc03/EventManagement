const isAdmin = (req, res, next) => {
  if (req.role !== 'Admin') {
    return res.status(406).json({ success: false, error: "Not allow (admin)" });
  } else {
    next();
  }
};

module.exports = { isAdmin };
