const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/scripts/create')
const { get } = require('../controllers/scripts/get')
const { getAll } = require('../controllers/scripts/getAll')
const { update } = require('../controllers/scripts/update')
const { _delete } = require('../controllers/scripts/delete')
const { start } = require('../controllers/scripts/start')
const { genDoc } = require('../controllers/scripts/genDoc')

router.post("/", authenticateToken, isAdmin, create)
router.post("/start", authenticateToken, isAdmin, start)
router.post("/genDoc", authenticateToken, genDoc)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router