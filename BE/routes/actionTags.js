const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/actionTags/create')
const { get } = require('../controllers/actionTags/get')
const { getAll } = require('../controllers/actionTags/getAll')
const { update } = require('../controllers/actionTags/update')
const { _delete } = require('../controllers/actionTags/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router