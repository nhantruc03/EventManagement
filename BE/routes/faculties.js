const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/faculties/create')
const { get } = require('../controllers/faculties/get')
const { getAll } = require('../controllers/faculties/getAll')
const { update } = require('../controllers/faculties/update')
const { _delete } = require('../controllers/faculties/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router