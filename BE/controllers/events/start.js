const Events = require("../../models/events")
const EventAssign = require("../../models/eventAssign")
const GuestTypes = require("../../models/guestTypes")
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
            $or: [
                { name: req.body.name }
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
        const newDoc = await Events.create([body], { session: session })

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
        let body_ref = {
            ...pick(req.body,
                "guestTypes",
                "guests",
                "groups",
                "eventAssigns"
            )
        }
        // newDoc._id
        // start Event Assign
        let listEventAssign = [];
        if (body_ref.eventAssigns) {
            //prepare data
            let body = [];
            body_ref.eventAssigns.map(element => {
                let temp = {}
                temp.userId = element.userId
                temp.roleId = element.roleId
                temp.facultyId = element.facultyId
                temp.eventId = newDoc[0]._id
                body.push(temp)
            })
            //access DB
            listEventAssign = await EventAssign.insertMany(
                body,
                { session: session }
            )

            if (isEmpty(listEventAssign) || listEventAssign.length != body.length) {
                await abortTransactions(sessions);
                return res.status(406).json({
                    success: false,
                    error: "Created failed"
                });
            }
            // Check duplicate guestTypes
            let findOldEventAssign = []
            body_ref.eventAssigns.forEach(element => {
                findOldEventAssign.push(
                    EventAssign.find({
                        $and: [
                            { userId: element.userId },
                            { eventId: newDoc[0]._id },
                        ],
                        isDeleted: false
                    }, null, { session })
                )
            })
            let OldEventAssign = await Promise.all(findOldEventAssign)

            let checkExist_forEventAssign = false;
            OldEventAssign.forEach(e => {
                if (e.length > 1) {
                    checkExist_forEventAssign = true
                }
            })
            if (checkExist_forEventAssign) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "Event Assign is already exist"
                });
            }
        }
        // done Event Assign
        // start guest type
        let listGuestTypes = [];
        if (body_ref.guestTypes) {
            //prepare data
            let body = [];
            body_ref.guestTypes.map(element => {
                let temp = {}
                temp.name = element
                temp.eventId = newDoc[0]._id
                body.push(temp)
            })
            //access DB
            listGuestTypes = await GuestTypes.insertMany(
                body,
                { session: session }
            )

            if (isEmpty(listGuestTypes) || listGuestTypes.length != body.length) {
                await abortTransactions(sessions);
                return res.status(406).json({
                    success: false,
                    error: "Created failed"
                });
            }
            // Check duplicate guestTypes
            let findOldGuestTypes = []
            body_ref.guestTypes.forEach(element => {
                findOldGuestTypes.push(
                    GuestTypes.find({
                        $and: [
                            { name: element.name },
                            { eventId: newDoc[0]._id },
                        ],
                        isDeleted: false
                    }, null, { session })
                )
            })
            let OldGuestTypes = await Promise.all(findOldGuestTypes)

            let checkExist_forGuestTypes = false;
            OldGuestTypes.forEach(e => {
                if (e.length > 1) {
                    checkExist_forGuestTypes = true
                }
            })
            if (checkExist_forGuestTypes) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "Guest Type is already exist"
                });
            }
        }
        // done guest types
        // start guest
        // listGuestTypes
        let listGuests = [];
        if (body_ref.guests) {
            let body = body_ref.guests.map(element =>
                pick(element,
                    "name",
                    "phone",
                    "email",
                    "guestTypeId"
                )
            )
            //prepare data
            body.forEach(e => {
                let temp = listGuestTypes.filter(x => x.name === e.guestTypeId)
                e.guestTypeId = temp[0]._id.toString()
            })
            //access DB
            listGuests = await Guests.insertMany(
                body,
                { session: session }
            )
            if (isEmpty(listGuests) || listGuests.length != body.length) {
                await abortTransactions(sessions);
                return res.status(406).json({
                    success: false,
                    error: "Created failed"
                });
            }
            // Check duplicate guest
            let findOldGuests = []
            body.forEach(element => {
                findOldGuests.push(
                    Guests.find({
                        $or: [
                            {
                                $and: [
                                    { email: element.email },
                                    { guestTypeId: element.guestTypeId }
                                ]
                            },
                            {
                                $and: [

                                    { phone: element.phone },
                                    { guestTypeId: element.guestTypeId }
                                ]
                            }
                        ]
                        ,
                        isDeleted: false,
                    }, null, { session })
                )
            })
            let OldGuests = await Promise.all(findOldGuests)

            let checkExist_forGuests = false;
            OldGuests.forEach(e => {
                if (e.length > 1) {
                    checkExist_forGuests = true
                }
            })
            if (checkExist_forGuests) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "Guest is already exist"
                });
            }
        }
        // done guest
        // start chat room
        let listGroups = [];
        if (body_ref.groups) {
            //prepare data
            let body = [];
            body_ref.groups.map(element => {
                let temp = {}
                temp.name = element
                temp.eventId = newDoc[0]._id
                body.push(temp)
            })
            //access DB
            listGroups = await Groups.insertMany(
                body,
                { session: session }
            )

            if (isEmpty(listGroups) || listGroups.length != body.length) {
                await abortTransactions(sessions);
                return res.status(406).json({
                    success: false,
                    error: "Created failed"
                });
            }
            // Check duplicate Groups
            let findOldGroups = []
            body_ref.groups.forEach(element => {
                findOldGroups.push(
                    Groups.find({
                        $and: [
                            { name: element.name },
                            { eventId: newDoc[0]._id },
                        ],
                        isDeleted: false
                    }, null, { session })
                )
            })
            let OldGroups = await Promise.all(findOldGroups)

            let checkExist_forGroups = false;
            OldGroups.forEach(e => {
                if (e.length > 1) {
                    checkExist_forGroups = true
                }
            })
            if (checkExist_forGroups) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "Chat room is already exist"
                });
            }
        }


        // Success
        await commitTransactions(sessions)
        return res.status(200).json({
            success: true,
            event: newDoc,
            guestTypes: listGuestTypes,
            guests: listGuests,
            groups: listGroups,
            eventAssign: listEventAssign
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