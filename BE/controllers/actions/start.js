const Actions = require("../../models/actions")
const ActionAssign = require("../../models/actionAssign")
const notifications = require("../../models/notifications")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { isEmpty, pick } = require("lodash")
const constants = require("../../constants/actions")
const Permission = require("../../helper/Permissions")
const start = async (req, res) => {
    let sessions = []
    try {
        //check permissson
        let permissons = await Permission.getPermission(req.body.eventId, req.user._id, req.user.roleId._id)
        if (!Permission.checkPermission(permissons, constants.QL_CONGVIEC_PERMISSION)) {

            return res.status(406).json({
                success: false,
                error: "Permission denied!"
            })
        }
        console.log('thỏa điều kiện')
        const query = {
            $and: [
                { name: req.body.name },
                { eventId: req.body.eventId },
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
        console.log('data', body)

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);


        // Access DB
        const newDoc = await Actions.create([body], { session: session })

        // Check duplicate
        const oldDocs = await Actions.find(query, null, { session })
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
                "ActionAssigns",
                "managerId"
            )
        }
        // newDoc._id
        // start Action Assign
        let listActionAssign = [];
        if (!isEmpty(newDoc[0].availUser)) {
            //prepare data
            let body = [];
            newDoc[0].availUser.map(element => {
                let temp = {
                    userId: element,
                    actionId: newDoc[0]._id
                }
                body.push(temp)
            })

            let temp_Manager = {
                userId: body_ref.managerId,
                role: 1,
                actionId: newDoc[0]._id
            };
            body.push(temp_Manager)


            //access DB
            listActionAssign = await ActionAssign.insertMany(
                body,
                { session: session }
            )

            if (isEmpty(listActionAssign) || listActionAssign.length != body.length) {
                await abortTransactions(sessions);
                return res.status(406).json({
                    success: false,
                    error: "Created action assign failed"
                });
            }
            // Check duplicate Action Assign
            let findOldActionAssign = []
            newDoc[0].availUser.forEach(element => {
                findOldActionAssign.push(
                    ActionAssign.find({
                        $and: [
                            { userId: element },
                            { actionId: newDoc[0]._id },
                        ],
                        isDeleted: false
                    }, null, { session })
                )
            })
            let OldActionAssign = await Promise.all(findOldActionAssign)

            let checkExist_forActionAssign = false;
            OldActionAssign.forEach(e => {
                if (e.length > 1) {
                    checkExist_forActionAssign = true
                }
            })
            if (checkExist_forActionAssign) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "Action Assign is already exist"
                });
            }
        }
        // done Action Assign
        // start notification
        let listNotifications = [];
        if (!isEmpty(listActionAssign)) {
            //prepare data
            let body = [];
            listActionAssign.map(element => {
                let temp = {}
                temp.name = "Phân công"
                temp.userId = element.userId
                temp.description = `Bạn được phân công vào công việc ${newDoc[0].name}`
                temp.actionId = newDoc[0]._id
                body.push(temp)
            })
            //access DB
            let temp_listNoti = await notifications.insertMany(
                body
            )

            let list_Id = temp_listNoti.reduce((list, e) => {
                list.push(e._id)
                return list;
            }, [])

            listNotifications = await notifications.find({ _id: { $in: list_Id } })
                .populate({ path: 'userId', select: 'push_notification_token' })

        }
        // done notification

        // Success
        await commitTransactions(sessions)
        const doc = await Actions.findOne({ _id: newDoc[0]._id, isDeleted: false })
            .populate({ path: 'availUser', select: 'name photoUrl' })
            .populate({ path: 'managerId', select: 'name photoUrl' })
            .populate({ path: 'tagsId', select: 'name background color' })
            .populate({ path: 'facultyId', select: 'name' })
            .populate({ path: 'priorityId', select: 'name' })
            .populate({ path: 'eventId', select: 'name expireDate beginDate' })
            .populate({ path: 'actionTypeId', select: 'name' })
        return res.status(200).json({
            success: true,
            action: doc,
            ActionAssign: listActionAssign,
            Notifications: listNotifications
        });
    } catch (error) {
        console.log(error.message)
        await abortTransactions(sessions)
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { start }