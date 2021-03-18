const { pick, isEmpty } = require('lodash')
const subActions = require('../../models/subActions')
const Actions = require('../../models/actions')

const getAllWithUserId = async (req, res) => {
    try {
        // for Actions 
        let query_Actions = { ...pick(req.body, "availUser"), isDeleted: false }
        docs = await Actions.find(query_Actions)

        if (!isEmpty(docs)) {
            let findSubActions = []

            docs.forEach(element => {
                findSubActions.push(
                    subActions.find({
                        actionId: element._id,
                        isDeleted: false
                    }, null)
                )
            })

            let listSubActions = await Promise.all(findSubActions)
            return res.status(200).json({
                success: true,
                data: listSubActions[0]
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


module.exports = { getAllWithUserId }