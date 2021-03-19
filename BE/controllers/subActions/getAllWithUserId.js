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
                ...pick(req.body, 'availUser'), isDeleted: false
            }
            // let query_Actions = {
            //     availUser: {
            //         $elemMatch: {
            //             $in: [
            //                 body.availUser
            //             ]
            //         }
            //     }
            // }
            const docs = await Actions.find(query_Actions)
            // console.log(docs)
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