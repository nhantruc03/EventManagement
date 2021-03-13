const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(body.actionId) || isEmpty(body.startDate) || isEmpty(body.endDate)) {
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
        "description",
      )
    }
  }
} // for newDoc

module.exports = { handleBody }