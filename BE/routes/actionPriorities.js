const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actionPriorities/create')
const { get } = require('../controllers/actionPriorities/get')
const { getAll } = require('../controllers/actionPriorities/getAll')
const { update } = require('../controllers/actionPriorities/update')
const { _delete } = require('../controllers/actionPriorities/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router