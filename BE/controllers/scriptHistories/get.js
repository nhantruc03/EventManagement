const scriptHistories = require('../../models/scriptHistories')

const get = async (req, res) => {
    try {
        const query = { _id: req.params.id, isDeleted: false }

        const doc = await scriptHistories.findOne(query)
            .populate({ path: 'userId', select: 'name' })
            .populate({ path: 'scriptId', populate: { path: 'forId', select: 'name' }, select: 'name forId' })
            .populate("scriptDetailId")
            .populate({ path: 'oldForIdScript', select: 'name' })
        return res.status(200).json({
            success: true,
            data: doc
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = { get }