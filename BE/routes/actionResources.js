const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actionResources/create')
const { getAll } = require('../controllers/actionResources/getAll')
const { _delete } = require('../controllers/actionResources/delete')

router.post("/", authenticateToken, isAdmin, create)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router