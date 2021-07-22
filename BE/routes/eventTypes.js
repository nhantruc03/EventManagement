const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/eventTypes/create')
const { get } = require('../controllers/eventTypes/get')
const { getAll } = require('../controllers/eventTypes/getAll')
const { update } = require('../controllers/eventTypes/update')
const { _delete } = require('../controllers/eventTypes/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router