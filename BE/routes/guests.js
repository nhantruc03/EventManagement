const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/guests/create')
const { get } = require('../controllers/guests/get')
const { getAll } = require('../controllers/guests/getAll')
const { update } = require('../controllers/guests/update')
const { _delete } = require('../controllers/guests/delete')

router.post("/", authenticateToken, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, update)
router.delete("/:id", authenticateToken, _delete)

module.exports = router