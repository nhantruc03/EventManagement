const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/chatMessages/create')
const { getAll } = require('../controllers/chatMessages/getAll')

router.post("/getAll", getAll)
router.post("/", create)

module.exports = router