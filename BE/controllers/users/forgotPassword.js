const Users = require("../../models/users")
const bcrypt = require('bcryptjs')
const { isEmpty, pick } = require("lodash")
const nodemailer = require('nodemailer');
const forgotPassword = async (req, res) => {
    try {

        // Handle data

        if (isEmpty(req.body.phone) || isEmpty(req.body.email)) {
            return res.status(406).json({
                success: false,
                error: "Missing fields!"
            })
        }
        const query = {
            ...pick(req.body,
                "phone",
                "email",
            ),
            isDeleted: false
        }

        const oldDocs = await Users.findOne(query)
        let newPass = Date.now() + Math.round(Math.random() * 1E9)
        newPass = newPass.toString()

        if (oldDocs) {
            let passBeforeHash = newPass
            newPass = await bcrypt.hashSync(newPass, 10);

            const newDoc = await Users.findOneAndUpdate(
                { _id: oldDocs._id },
                {
                    password: newPass
                })
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '17520122@gm.uit.edu.vn',
                    pass: 'A0917220428'
                }
            });

            var mailOptions = {
                from: '17520122@gm.uit.edu.vn',
                to: req.body.email,
                subject: 'EM cập nhật mật khẩu',
                text: `Mật khẩu mới của bạn là ${passBeforeHash}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.status(406).json({
                        success: false,
                        data: "Hệ thông mail có lỗi"
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        data: "Mật khẩu mới đã được gửi tới email của bạn"
                    });
                }
            });
        } else {
            return res.status(406).json({
                success: false,
                data: "Thông tin không hợp lệ"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { forgotPassword }