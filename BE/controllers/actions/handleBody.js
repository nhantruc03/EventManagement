const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(body.eventId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "endTime",
        "endDate",
        "description",
        "eventId",
        "dependActionId",
        "priorityId",
        "tagsId",
        "facultyId",
        "coverUrl",
        "availUser",
        "actionTypeId",
        "managerId",
        "isClone"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }