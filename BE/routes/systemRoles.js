const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/systemRoles/create')
const { get } = require('../controllers/systemRoles/get')
const { getAll } = require('../controllers/systemRoles/getAll')
const { update } = require('../controllers/systemRoles/update')
const { _delete } = require('../controllers/systemRoles/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router