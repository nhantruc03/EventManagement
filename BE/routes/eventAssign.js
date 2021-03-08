const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/eventAssign/create')
const { get } = require('../controllers/eventAssign/get')
const { getAll } = require('../controllers/eventAssign/getAll')
const { update } = require('../controllers/eventAssign/update')
const { _delete } = require('../controllers/eventAssign/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router