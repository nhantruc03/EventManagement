const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/guestTypes/create')
const { get } = require('../controllers/guestTypes/get')
const { getAll } = require('../controllers/guestTypes/getAll')
const { update } = require('../controllers/guestTypes/update')
const { _delete } = require('../controllers/guestTypes/delete')

router.post("/", authenticateToken, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, update)
router.delete("/:id", authenticateToken, _delete)

module.exports = router