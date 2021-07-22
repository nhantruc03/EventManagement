const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/events/create')
const { start } = require('../controllers/events/start')
const { startClone } = require('../controllers/events/startClone')
const { get } = require('../controllers/events/get')
const { getAll } = require('../controllers/events/getAll')
const { update } = require('../controllers/events/update')
const { _delete } = require('../controllers/events/delete')
// const { getProcess } = require('../controllers/events/getProcess')

router.post("/", authenticateToken, create)
router.post("/start", authenticateToken, start)
router.post("/start-clone", authenticateToken, startClone)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, update)
router.delete("/:id", authenticateToken, _delete)
// router.get("/process/:id", authenticateToken, isAdmin, getProcess)

module.exports = router