const Scripts = require("../../models/scripts")
const ScriptDetails = require("../../models/scriptDetails")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { isEmpty, pick, result } = require("lodash")
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const notifications = require("../../models/notifications")
const start = async (req, res) => {
    let sessions = []
    try {
        //check permissson
        let permissons = await Permission.getPermission(req.body.eventId, req.user._id, req.user.roleId._id)
        if (!Permission.checkPermission(permissons, constants.QL_KICHBAN_PERMISSION)) {
            return res.status(406).json({
                success: false,
                error: "Permission denied!"
            })
        }
        const query = {
            $and: [
                { name: req.body.name },
                { eventId: req.body.eventId }
            ],
            isDeleted: false
        } // for oldDocs

        // Handle data
        const { error, body } = handleBody(req.body) // for newDoc
        if (error) {
            return res.status(406).json({
                success: false,
                error: error
            })
        }

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);


        // Access DB
        const newDoc = await Scripts.create([body], { session: session })

        // Check duplicate
        const oldDocs = await Scripts.find(query, null, { session })
        if (oldDocs.length > 1) {
            await abortTransactions(sessions)
            return res.status(406).json({
                success: false,
                error: "Duplicate data"
            })
        }
        // done event
        let body_ref = {
            ...pick(req.body,
                "listscriptdetails"
            )
        }
        // newDoc._id
        // start guest type
        let listScriptDetails = [];
        if (!isEmpty(body_ref.listscriptdetails)) {
            //prepare data
            let body = [];
            body_ref.listscriptdetails.map(element => {
                let temp = {}
                temp.name = element.name
                temp.scriptId = newDoc[0]._id
                temp.description = element.description
                temp.time = element.time
                body.push(temp)
            })
            //access DB
            listScriptDetails = await ScriptDetails.insertMany(
                body,
                { session: session }
            )

            if (isEmpty(listScriptDetails) || listScriptDetails.length != body.length) {
                await abortTransactions(sessions);
                return res.status(406).json({
                    success: false,
                    error: "Created failed"
                });
            }
            // Check duplicate ScriptDetails
            let findOldScriptDetails = []
            body_ref.listscriptdetails.forEach(element => {
                findOldScriptDetails.push(
                    ScriptDetails.find({
                        $and: [
                            { name: element.name },
                            { scriptId: element.scriptId },
                        ],
                        isDeleted: false
                    }, null, { session })
                )
            })
            let OldScriptDetails = await Promise.all(findOldScriptDetails)

            let checkExist_forScriptDetails = false;
            OldScriptDetails.forEach(e => {
                if (e.length > 1) {
                    checkExist_forScriptDetails = true
                }
            })
            if (checkExist_forScriptDetails) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "Script details is already exist"
                });
            }
        }
        // done guest types
        // start notification
        const curDoc = await Scripts.findOne({ _id: newDoc[0]._id }, null, { session: session })
            .populate({ path: 'eventId', select: 'name' })
        //prepare data
        let noti = {}
        noti.name = "Tạo mới"
        noti.userId = curDoc.forId
        noti.description = `Sự kiện ${curDoc.eventId.name} đã được tạo kịch bản ${curDoc.name}`
        noti.scriptId = curDoc._id
        //access DB
        let created_notification = await notifications.create(
            noti
        )
        let result_noti = await notifications.findById(created_notification._id)
            .populate({path:'userId',select:'push_notification_token'})
        // done notification
        // Success
        await commitTransactions(sessions)
        return res.status(200).json({
            success: true,
            script: newDoc,
            ScriptDetails: listScriptDetails,
            notification: result_noti
        });
    } catch (error) {
        await abortTransactions(sessions)
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { start }