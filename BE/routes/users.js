const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/users/create')
const { get } = require('../controllers/users/get')
const { getAll } = require('../controllers/users/getAll')
const { update } = require('../controllers/users/update')
const { _delete } = require('../controllers/users/delete')
const { login } = require('../controllers/users/login')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)
router.post("/login", login)

module.exports = router