const ActionAssign = require('../../models/actionAssign')
const calcProcess = async (id) => {
  
  const query = { isDeleted: false }
  const docs = await ActionAssign.find(query).populate({ path: "actionId", select: "eventId dependActionId" })

  let childActions = docs.filter(e => e.actionId.eventId == id)

  let done_childActions = childActions.filter(e => (e.status === true && e.actionId.dependActionId === undefined))

  return (done_childActions.length/childActions.length)*100;
}
module.exports = { calcProcess };