const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.eventId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "eventId",
        // "faculties"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }