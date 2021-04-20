const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.userId) || isEmpty(body.eventId)) {
    return {
      error: "Missing fields!"
    }
  }

  return {
    error: null,
    body: {
      ...pick(body,
        "userId",
        "eventId",
        "roleId",
        "facultyId",
        "credentialsId"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }