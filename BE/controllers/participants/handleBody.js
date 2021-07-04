const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  return {
    error: null,
    body: {
      ...pick(body,
        "eventId",
        "name",
        "phone",
        "email",
        "mssv",
        "status"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }