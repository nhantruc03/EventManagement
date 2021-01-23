const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actionAssign/create')
const { get } = require('../controllers/actionAssign/get')
const { getAll } = require('../controllers/actionAssign/getAll')
const { update } = require('../controllers/actionAssign/update')
const { _delete } = require('../controllers/actionAssign/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router