const Users = require("../../models/users")
const { startSession } = require('mongoose')
const bcrypt = require('bcryptjs')
const { commitTransactions, abortTransactions } = require('../../services/transaction')
// const ChatRooms = require("../../models/chatRooms")
const { isEmpty, isArray, pick } = require("lodash")
const createMany = async (req, res) => {
    let sessions = []
    try {
        if (isArray(req.body) !== true) {
            return res.status(406).json({
                success: false,
                error: "You must be pass an array"
            });
        }

        // Handle data
        let body = req.body.map(element =>
            pick(element,
                "name",
                "birthday",
                "address",
                "phone",
                "username",
                "password",
                "email",
                "gender"
            )
        )

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        // Hash password
        await body.forEach(async (e) => {
            if (e.password != null) {
                e.password = await bcrypt.hashSync(e.password, 10);
                console.log(e.password)
            }
        })
        //get List userBefore create
        // const listOldUser = await Users.find().select('_id')

        // Access DB
        const newDoc = await Users.insertMany(
            body,
            { session: session }
        )

        if (isEmpty(newDoc) || newDoc.length != body.length) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }
        // Check duplicate
        let findOldUser = []
        body.forEach(element => {
            findOldUser.push(
                Users.find({
                    $or: [
                        { phone: element.phone },
                        { email: element.email },
                        { username: element.username },
                    ],
                    isDeleted: false
                }, null, { session })
            )
        })
        let OldUser = await Promise.all(findOldUser)

        let checkExist_forUser = false;
        OldUser.forEach(e => {
            if (e.length > 1) {
                checkExist_forUser = true
            }
        })
        if (checkExist_forUser) {
            await abortTransactions(sessions);
            return res.status(409).json({
                success: false,
                error: "Users is already exist"
            });
        }

        // //create chatRoom with other users

        // let listRoomNeed = [];
        // // new users - old users
        // newDoc.forEach(user1 => {
        //     listOldUser.forEach(user2 => {
        //         let temp = {
        //             userID1: user1._id,
        //             userID2: user2._id
        //         }
        //         listRoomNeed.push(temp)
        //     })
        // })
        // // new users - new users
        // if (newDoc.length > 1) {
        //     for (i = 0; i < newDoc.length - 1; i++) {
        //         for (j = i + 1; j < newDoc.length; j++) {
        //             let temp = {
        //                 userID1: newDoc[i]._id,
        //                 userID2: newDoc[j]._id
        //             }
        //             listRoomNeed.push(temp)
        //         }
        //     }
        // }

        // // Access DB
        // // Create Rooms
        // const newDoc_Room = await ChatRooms.insertMany(
        //     listRoomNeed,
        //     { session: session }
        // )

        // if (isEmpty(newDoc_Room) || newDoc_Room.length != listRoomNeed.length) {
        //     await abortTransactions(sessions);
        //     return res.status(406).json({
        //         success: false,
        //         error: "Created failed"
        //     });
        // }

        // Success
        await commitTransactions(sessions)
        return res.status(200).json({
            success: true,
            data: newDoc
        });
    } catch (error) {
        await abortTransactions(sessions)
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { createMany }