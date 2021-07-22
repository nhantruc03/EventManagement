const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/participants/create')
const { get } = require('../controllers/participants/get')
const { getAll } = require('../controllers/participants/getAll')
const { update } = require('../controllers/participants/update')
const { _delete } = require('../controllers/participants/delete')

router.post("/", authenticateToken, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, update)
router.delete("/:id", authenticateToken, _delete)

module.exports = router