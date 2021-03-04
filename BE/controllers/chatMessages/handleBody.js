const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.groupId) || isEmpty(body.userID) || isEmpty(body.text)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "groupId",
        "userID",
        "text"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }