const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/events/create')
const { get } = require('../controllers/events/get')
const { getAll } = require('../controllers/events/getAll')
const { update } = require('../controllers/events/update')
const { _delete } = require('../controllers/events/delete')
const { getProcess } = require('../controllers/events/getProcess')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)
router.get("/process/:id", authenticateToken, isAdmin, getProcess)

module.exports = router