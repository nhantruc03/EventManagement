const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { get } = require('../controllers/scriptHistories/get')
const { getAll } = require('../controllers/scriptHistories/getAll')

router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)

module.exports = router