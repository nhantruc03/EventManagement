const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actions/create')
const { get } = require('../controllers/actions/get')
const { getAll } = require('../controllers/actions/getAll')
const { update } = require('../controllers/actions/update')
const { _delete } = require('../controllers/actions/delete')
const { getProcess } = require('../controllers/actions/getProcess')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)
router.get("/process/:id", authenticateToken, isAdmin, getProcess)

module.exports = router