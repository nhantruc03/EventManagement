const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/groups/create')
const { getAll } = require('../controllers/groups/getAll')

router.post("/", create)
router.post("/getAll", authenticateToken, isAdmin, getAll)

module.exports = router