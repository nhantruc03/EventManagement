const Users = require('../../models/users')
const bcrypt = require("bcryptjs")
const { isEmpty, pick } = require('lodash');
const updatePushToken = async (req, res) => {
    try {
        // Check owner:  not admin && not owner => out
        const user = await Users
            .findOne({ _id: req.params.id, isDeleted: false })

        if (!req.user._id === req.params.id) {
            return res.status(406).json({
                success: false,
                error: "Can not access others user information"
            })
        }
        const body = {
            ...pick(
                req.body,
                "push_notification_token",
            )
        }

        //query
        const queryUpdate = { _id: req.params.id, isDeleted: false }

        //access db
        const updated = await Users.findOneAndUpdate(
            queryUpdate,
            body,
            { new: true }
        )

        // Updated Successfully
        return res.status(200).json({
            success: true,
            data: updated
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = { updatePushToken }