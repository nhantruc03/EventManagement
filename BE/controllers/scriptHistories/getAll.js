const { pick } = require('lodash')
const scriptHistories = require('../../models/scriptHistories')

const getAll = async (req, res) => {
    const page = Number(req.query.page) // page index
    const limit = Number(req.query.limit) // limit docs per page

    try {
        const query = { ...pick(req.body, "scriptId"), isDeleted: false }

        let docs;
        if (!page || !limit) {
            docs = await scriptHistories.find(query)
                .populate({ path: 'userId', select: 'name photoUrl' })
                .populate({ path: 'scriptId', populate: { path: 'forId', select: 'name' }, select: 'name forId' })
                .populate("scriptDetailId")
                .populate({ path: 'oldForIdScript', select: 'name' })
                .populate({ path: 'newForIdScript', select: 'name' })
        }
        else {
            docs = await scriptHistories.find(query)
                .populate({ path: 'userId', select: 'name photoUrl' })
                .populate({ path: 'scriptId', populate: { path: 'forId', select: 'name' }, select: 'name forId' })
                .populate("scriptDetailId")
                .populate({ path: 'oldForIdScript', select: 'name' })
                .populate({ path: 'newForIdScript', select: 'name' })
                .skip(limit * (page - 1))
                .limit(limit)
        }
        return res.status(200).json({
            success: true,
            data: docs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { getAll }