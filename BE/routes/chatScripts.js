const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/chatScripts/create')
const { getAll } = require('../controllers/chatScripts/getAll')

router.post("/getAll", getAll)
router.post("/", create)

module.exports = router