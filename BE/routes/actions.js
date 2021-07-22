const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actions/create')
const { get } = require('../controllers/actions/get')
const { getAll } = require('../controllers/actions/getAll')
const { update } = require('../controllers/actions/update')
const { _delete } = require('../controllers/actions/delete')
const { start } = require('../controllers/actions/start')

router.post("/", authenticateToken, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, update)
router.delete("/:id", authenticateToken, _delete)
router.post("/start", authenticateToken, start)
module.exports = router