const { pick, isEmpty } = require('lodash')
const subActions = require('../../models/subActions')
const Actions = require('../../models/actions')

const getAllWithUserId = async (req, res) => {
    try {
        // for Actions
        let body = {
            ...pick(req.body,
                'availUser')
        }
        if (!isEmpty(body.availUser)) {
            let query_Actions = {
                ...pick(req.body, 'availUser'), isDeleted: false, isClone: false
            }

            const docs = await Actions.find(query_Actions)
                .populate({ path: 'eventId', select: 'isDeleted' })


            if (!isEmpty(docs)) {
                let findSubActions = []

                docs.forEach(element => {
                    if (!element.eventId.isDeleted) {
                        findSubActions.push(
                            subActions.find({
                                actionId: element._id,
                                isDeleted: false
                            })
                        )
                    }
                })

                let listSubActions = await Promise.all(findSubActions)

                let result = []
                listSubActions.forEach(e => {
                    result = [...result, ...e]
                })

                return res.status(200).json({
                    success: true,
                    data: result
                });
            } else {
                return res.status(200).json({
                    success: true,
                    data: []
                });
            }
        } else {
            return res.status(406).json({
                success: false,
                error: 'Need pass availUser'
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