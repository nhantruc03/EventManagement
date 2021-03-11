const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(body.startDate) || isEmpty(body.endDate) || isEmpty(body.eventId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "startDate",
        "endDate",
        "description",
        "eventId",
        "dependActionId",
        "priorityId",
        "tagsId",
        "facultyId",
        "coverUrl",
        "availUser",
        "actionTypeId"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }