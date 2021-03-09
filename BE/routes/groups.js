const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/groups/create')
const { getAll } = require('../controllers/groups/getAll')
const { get } = require('../controllers/groups/get')
const { update } = require('../controllers/groups/update')
const { _delete } = require('../controllers/groups/delete')




router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, isAdmin, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)
module.exports = router