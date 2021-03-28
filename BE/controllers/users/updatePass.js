const Users = require('../../models/users')
const bcrypt = require("bcryptjs")
const { isEmpty, pick } = require('lodash');
const updatePass = async (req, res) => {
    try {
        // Check owner:  not admin && not owner => out
        const user = await Users
            .findOne({ _id: req.params.id, isDeleted: false }).select("password _id")

        // const role = await Credentials
        //   .findOne({ userId: req.user._id, isDeleted: false })
        //   .populate({ path: 'roleId', select: 'name' })

        if (!req.user._id === req.params.id) {
            return res.status(406).json({
                success: false,
                error: "Can not access others user information"
            })
        }
        const body = {
            ...pick(
                req.body,
                "currentPass",
                "newPass",
                "newCheckPass",
            )
        }

        //query
        const queryUpdate = { _id: req.params.id, isDeleted: false }

        // Handle data

        if (isEmpty(body.currentPass) || isEmpty(body.newPass)) {
            return res.status(406).json({
                success: false,
                error: "Missing fields"
            })
        }


        // Hash password

        let updated
        const isSame = await bcrypt.compareSync(body.currentPass, user.password);
        if (!isSame) {
            return res.status(406).json({
                success: false,
                error: "Not correct password"
            })
        }
        else {
            let newPassword = await bcrypt.hashSync(body.newPass, 10);

            updated = await Users.findOneAndUpdate(
                queryUpdate,
                {
                    password: newPassword
                },
                { new: true }
            )
        }

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

module.exports = { updatePass }