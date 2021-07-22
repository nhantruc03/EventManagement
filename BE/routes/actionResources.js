const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actionResources/create')
const { getAll } = require('../controllers/actionResources/getAll')
const { _delete } = require('../controllers/actionResources/delete')

router.post("/", authenticateToken, create)
router.post("/getAll", authenticateToken, getAll)
router.delete("/:id", authenticateToken, _delete)

module.exports = router