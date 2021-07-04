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
                        { mssv: element.mssv }
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