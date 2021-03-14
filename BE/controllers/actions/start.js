const Actions = require("../../models/actions")
const ActionAssign = require("../../models/actionAssign")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { isEmpty, pick } = require("lodash")
const start = async (req, res) => {
    let sessions = []
    try {
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
                    error: "Created failed"
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

        // Success
        await commitTransactions(sessions)
        const doc = await Actions.findOne({ _id: newDoc[0]._id, isDeleted: false })
            .populate({ path: 'availUser', select: 'name photoUrl' })
            .populate({ path: 'tagsId', select: 'name' })
            .populate({ path: 'facultyId', select: 'name' })
            .populate({ path: 'priorityId', select: 'name' })
            .populate({ path: 'eventId', select: 'name' })
            .populate({ path: 'actionTypeId', select: 'name' })
        return res.status(200).json({
            success: true,
            action: doc,
            ActionAssign: listActionAssign
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