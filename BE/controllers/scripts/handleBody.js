const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(body.writerId) || isEmpty(body.forId) || isEmpty(body.eventId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "writerId",
        "forId",
        "eventId"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }