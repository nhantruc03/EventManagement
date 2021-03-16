const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(body.actionId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "actionId",
        "name",
        "startDate",
        "endDate",
        "startTime",
        "endTime",
        "description",
      )
    }
  }
} // for newDoc

module.exports = { handleBody }