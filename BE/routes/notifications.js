const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { getAll } = require('../controllers/notifications/getAll')
const { update } = require('../controllers/guestTypes/update')

router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)

module.exports = router