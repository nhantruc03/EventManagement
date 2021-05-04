const Events = require("../../models/events")
const GuestTypes = require("../../models/guestTypes")
const Groups = require("../../models/groups")
const Scripts = require("../../models/scripts")
const ScriptDetails = require('../../models/scriptDetails')
const ActionTypes = require('../../models/actionTypes')
const Actions = require('../../models/actions')
const SubActions = require('../../models/subActions')
const ActionResources = require('../../models/actionResources')
const { handleBody } = require("./handleBody")
// const { handleBodyGuestType } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
const { pick } = require("lodash")
const startClone = async (req, res) => {
    let sessions = []
    try {
        const query = {
            $or: [
                {
                    $and: [
                        { name: req.body.name },
                        { isClone: true },
                    ],
                    $and: [
                        { name: req.body.name },
                        { isClone: false },
                    ],
                },

            ],
            isDeleted: false
        } // for oldDocs

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);
        let body_ref = {
            ...pick(req.body,
                "eventId"
            )
        }


        const docEvent = await Events.findOne({ _id: body_ref.eventId, isDeleted: false, isClone: true })

        // Handle data
        const { error, body } = handleBody(docEvent) // for newDoc
        if (error) {
            return res.status(406).json({
                success: false,
                error: error
            })
        }
        let temp_body = {
            ...body,
            isClone: false
        }
        // Access DB
        const newDoc = await Events.create([temp_body], { session: session })

        // Check duplicate
        const oldDocs = await Events.find(query, null, { session })
        if (oldDocs.length > 1) {
            await abortTransactions(sessions)
            return res.status(406).json({
                success: false,
                error: "Duplicate data"
            })
        }
        // done event

        // newDoc._id
        // start guest type
        let listGuestTypes = [];

        const clone_GuestTypes = await GuestTypes.find({
            eventId: docEvent._id,
            isDeleted: false
        })
        let data_insert_guestTypes = []
        clone_GuestTypes.forEach(e => {
            let temp = {
                ...pick(e,
                    "name"
                ),
                eventId: newDoc[0]._id
            }
            data_insert_guestTypes.push(temp)
        })
        listGuestTypes = await GuestTypes.insertMany(
            data_insert_guestTypes,
            { session: session }
        )
        // done guest types
        // start Groups
        let listGroups = [];
        const clone_Groups = await Groups.find({
            eventId: docEvent._id,
            isDeleted: false,
        })
        let data_insert_groups = []
        clone_Groups.forEach(e => {
            let temp = {
                ...pick(e,
                    "name"
                ),
                eventId: newDoc[0]._id
            }
            data_insert_groups.push(temp)
        })

        listGroups = await Groups.insertMany(
            data_insert_groups,
            { session: session }
        )

        // done Groups

        // start scripts
        // start script details
        let listScripts = [];
        let listScriptDetails = [];
        const clone_Scripts = await Scripts.find({ eventId: docEvent._id, isDeleted: false })
        // for (const e of clone_Scripts) {
        await Promise.all(clone_Scripts.map(async (e) => {
            let clone_ScriptDetails = await ScriptDetails.find({ scriptId: e._id, isDeleted: false })

            let data_insert_Script = {
                ...pick(e,
                    "name",
                    "writerId",
                    "forId",
                ),
                eventId: newDoc[0]._id
            }

            let new_Script = await Scripts.create([data_insert_Script], { session: session })

            listScripts.push(new_Script[0])
            let data_insert_ScriptDetails = []
            clone_ScriptDetails.forEach(e => {
                let temp = {
                    ...pick(e,
                        "name",
                        "description",
                        "time",
                    ),
                    scriptId: new_Script[0]._id
                }
                data_insert_ScriptDetails.push(temp)
            })
            listScriptDetails = await ScriptDetails.insertMany(
                data_insert_ScriptDetails,
                { session: session }
            )
        }))
        // done scripts
        // done script details


        // start action types
        // start actions
        // start sub actions
        // start sub resources
        let listActionTypes = [];
        let listActions = [];
        let listSubActions = [];
        let listActionResources = [];
        const clone_ActionTypes = await ActionTypes.find({ eventId: docEvent._id, isDeleted: false })
        await Promise.all(clone_ActionTypes.map(async e => {
            let clone_Actions = await Actions.find({ eventId: docEvent._id, actionTypeId: e._id, isDeleted: false })
            let data_insert_ActionTypes = {
                ...pick(e,
                    "name",
                ),
                eventId: newDoc[0]._id
            }
            let new_ActionTypes = await ActionTypes.create([data_insert_ActionTypes], { session: session })
            listActionTypes.push(new_ActionTypes[0])

            await Promise.all(clone_Actions.map(async a => {

                let clone_SubActions = await SubActions.find({ actionId: a._id, isDeleted: false })
                let clone_ActionResources = await ActionResources.find({ actionId: a._id, isDeleted: false })
                let data_insert_Actions = {
                    ...pick(a,
                        "name",
                        "endTime",
                        "endDate",
                        "description",
                        "priorityId",
                        "tagsId",
                        "facultyId",
                        "coverUrl",
                        "availUser",
                    ),
                    eventId: newDoc[0]._id,
                    actionTypeId: new_ActionTypes[0]._id
                }

                let new_Actions = await Actions.create([data_insert_Actions], { session: session })
                listActions.push(new_Actions[0])

                let data_insert_SubActions = []
                clone_SubActions.forEach(e => {
                    let temp = {
                        ...pick(e,
                            "name",
                            "endDate",
                            "startTime",
                            "endTime",
                            "description",
                        ),
                        actionId: new_Actions[0]._id
                    }
                    data_insert_SubActions.push(temp)
                })
                listSubActions = await SubActions.insertMany(
                    data_insert_SubActions,
                    { session: session }
                )

                let data_insert_ActionResources = []
                clone_ActionResources.forEach(e => {
                    let temp = {
                        ...pick(e,
                            "url",
                            "extension"
                        ),
                        actionId: new_Actions[0]._id
                    }
                    data_insert_ActionResources.push(temp)
                })
                listActionResources = await ActionResources.insertMany(
                    data_insert_ActionResources,
                    { session: session }
                )
            }))


        }))
        // done action types
        // done actions
        // done sub actions
        // done sub action resources

        let result = {
            success: true,
            event: newDoc,
            listActionTypes: listActionTypes,
            listActions: listActions,
            listSubActions: listSubActions,
            listActionResources: listActionResources,
            listScripts: listScripts,
            listScriptDetails: listScriptDetails,
            listGroups: listGroups,
            listGuestTypes: listGuestTypes,
        }

        // Success

        await commitTransactions(sessions)
        return res.status(200).json(result);
    } catch (error) {
        await abortTransactions(sessions)
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { startClone }