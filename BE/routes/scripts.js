const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/scripts/create')
const { get } = require('../controllers/scripts/get')
const { getAll } = require('../controllers/scripts/getAll')
const { update } = require('../controllers/scripts/update')
const { _delete } = require('../controllers/scripts/delete')
const { start } = require('../controllers/scripts/start')

router.post("/", authenticateToken, isAdmin, create)
router.post("/start", authenticateToken, isAdmin, start)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router