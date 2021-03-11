const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actionTypes/create')
const { get } = require('../controllers/actionTypes/get')
const { getAll } = require('../controllers/actionTypes/getAll')
const { update } = require('../controllers/actionTypes/update')
const { _delete } = require('../controllers/actionTypes/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router