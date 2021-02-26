const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/credentials/create')
const { get } = require('../controllers/credentials/get')
const { getAll } = require('../controllers/credentials/getAll')
const { update } = require('../controllers/credentials/update')
const { _delete } = require('../controllers/credentials/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router