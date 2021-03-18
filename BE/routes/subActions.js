const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/subActions/create')
const { get } = require('../controllers/subActions/get')
const { getAll } = require('../controllers/subActions/getAll')
const { getAllWithUserId } = require('../controllers/subActions/getAllWithUserId')
const { update } = require('../controllers/subActions/update')
const { _delete } = require('../controllers/subActions/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.post("/getAllWithUserId", authenticateToken, isAdmin, getAllWithUserId)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router