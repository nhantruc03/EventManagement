const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/scriptDetails/create')
const { get } = require('../controllers/scriptDetails/get')
const { getAll } = require('../controllers/scriptDetails/getAll')
const { update } = require('../controllers/scriptDetails/update')
const { _delete } = require('../controllers/scriptDetails/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router