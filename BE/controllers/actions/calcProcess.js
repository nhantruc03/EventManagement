const ActionAssign = require('../../models/actionAssign')
// const Actions = require('../../models/actions')
const calcProcess = async (id) => {
    const query = { isDeleted: false }

    const docs = await ActionAssign.find(query).populate({ path: "actionId", select: "dependActionId" })

    let childActions = docs.filter(e => e.actionId.dependActionId == id)

    if (childActions.length > 0) {
        let done_childActions = childActions.filter(e => e.status === true)
        return (done_childActions.length / childActions.length) * 100;
    } else {
        let cur_actions = await ActionAssign.find({ actionId: id ,isDeleted: false });
        let cur_doneActions = cur_actions.filter(e => e.status === true)
        return (cur_doneActions.length / cur_actions.length) * 100;
    }
}

module.exports = { calcProcess };
