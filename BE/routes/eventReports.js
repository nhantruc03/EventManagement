const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/eventReports/create')
const { get } = require('../controllers/eventReports/get')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)

module.exports = router