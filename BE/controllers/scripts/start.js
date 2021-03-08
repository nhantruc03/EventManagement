const Scripts = require("../../models/scripts")
const ScriptDetails = require("../../models/scriptDetails")
const Guests = require("../../models/guests")
const Groups = require("../../models/groups")
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
        if (body_ref.listscriptdetails) {
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
        // Success
        await commitTransactions(sessions)
        return res.status(200).json({
            success: true,
            script: newDoc,
            ScriptDetails: listScriptDetails,
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